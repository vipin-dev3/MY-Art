import React, { useRef, useState, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, Text } from '@react-three/drei';
import * as THREE from 'three';

// Crash-safe error boundary for texture loading
class FrameErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('Frame image texture load error caught:', err);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * 3D Art Frame with real depth, museum passe-partout matting,
 * glass glare specular reflection, and interactive 3D tilt effect on hover.
 */
export default function ArtFrame({
  artwork,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isActive = false,
  onSelect,
  onInspect,
}) {
  const groupRef = useRef();
  const innerMeshRef = useRef();
  const glassRef = useRef();

  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Calculate frame proportions based on artwork aspect ratio
  const { width, height } = useMemo(() => {
    const isLandscape = artwork.orientation === 'landscape' || artwork.aspectRatio > 1;
    if (isLandscape) {
      const w = 2.8;
      const h = w / (artwork.aspectRatio || 1.35);
      return { width: w, height: Math.max(1.8, Math.min(2.4, h)) };
    } else {
      const h = 2.8;
      const w = h * (artwork.aspectRatio || 0.75);
      return { width: Math.max(1.8, Math.min(2.4, w)), height: h };
    }
  }, [artwork]);

  const mattingPadding = 0.28;
  const frameBorder = 0.12;
  const outerWidth = width + mattingPadding * 2 + frameBorder * 2;
  const outerHeight = height + mattingPadding * 2 + frameBorder * 2;
  const frameDepth = 0.16;

  // Handle pointer movement for interactive 3D tilt effect
  const handlePointerMove = (e) => {
    e.stopPropagation();
    if (!e.uv) return;
    // Map UV coordinates (0..1) to tilt angles (-0.25 to 0.25 rad)
    const tiltX = (e.uv.y - 0.5) * 0.35;
    const tiltY = (e.uv.x - 0.5) * -0.35;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handlePointerOut = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  useFrame((state, delta) => {
    if (!innerMeshRef.current) return;

    // Smoothly interpolate the tilt rotation
    const targetRotX = hovered ? tilt.x : 0;
    const targetRotY = hovered ? tilt.y : 0;
    const targetZ = isActive ? 0.35 : (hovered ? 0.2 : 0);

    innerMeshRef.current.rotation.x = THREE.MathUtils.lerp(innerMeshRef.current.rotation.x, targetRotX, 0.1);
    innerMeshRef.current.rotation.y = THREE.MathUtils.lerp(innerMeshRef.current.rotation.y, targetRotY, 0.1);
    innerMeshRef.current.position.z = THREE.MathUtils.lerp(innerMeshRef.current.position.z, targetZ, 0.1);

    // Dynamic glass glare movement
    if (glassRef.current && hovered) {
      glassRef.current.material.opacity = THREE.MathUtils.lerp(
        glassRef.current.material.opacity,
        0.28,
        0.1
      );
    } else if (glassRef.current) {
      glassRef.current.material.opacity = THREE.MathUtils.lerp(
        glassRef.current.material.opacity,
        0.12,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Outer tilting assembly */}
      <group
        ref={innerMeshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={(e) => {
          e.stopPropagation();
          if (isActive) {
            onInspect?.(artwork);
          } else {
            onSelect?.(artwork);
          }
        }}
      >
        {/* Outer Frame - Ebony / Dark Charcoal Wood with chamfer */}
        <mesh position={[0, 0, -frameDepth / 2]} castShadow receiveShadow>
          <boxGeometry args={[outerWidth, outerHeight, frameDepth]} />
          <meshStandardMaterial
            color={isActive ? '#252119' : (hovered ? '#1e1c18' : '#141416')}
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>

        {/* Thin Gold / Brass Inlay Accent around Frame */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[outerWidth - 0.06, outerHeight - 0.06]} />
          <meshStandardMaterial
            color={isActive ? '#c5a059' : (hovered ? '#a3823e' : '#453a25')}
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>

        {/* Archival Passe-Partout (Matting Board) - Warm Textured Ivory */}
        <mesh position={[0, 0, 0.02]} receiveShadow>
          <planeGeometry args={[width + mattingPadding * 2, height + mattingPadding * 2]} />
          <meshStandardMaterial
            color="#f7f5f0"
            roughness={0.92}
            metalness={0.02}
          />
        </mesh>

        {/* The Artwork Canvas with High-Quality Image Texture */}
        <group position={[0, 0, 0.035]}>
          <FrameErrorBoundary
            fallback={
              <mesh>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial color="#1f1e24" roughness={0.8} />
              </mesh>
            }
          >
            <Suspense
              fallback={
                <mesh>
                  <planeGeometry args={[width, height]} />
                  <meshStandardMaterial color="#222226" roughness={0.8} />
                </mesh>
              }
            >
              <Image
                url={artwork.image}
                scale={[width, height]}
                alt={artwork.title}
                transparent
                toneMapped={false}
                crossOrigin="anonymous"
              />
            </Suspense>
          </FrameErrorBoundary>
        </group>

        {/* Glass Reflection Plane with Glare Shimmer */}
        <mesh ref={glassRef} position={[0, 0, 0.055]}>
          <planeGeometry args={[width + mattingPadding * 2, height + mattingPadding * 2]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.14}
            roughness={0.05}
            metalness={0.2}
            transmission={0.88}
            ior={1.52}
            reflectivity={0.9}
            color="#f8fafc"
            depthWrite={false}
          />
        </mesh>

        {/* Subtle Frame Halo Glow when hovered or active */}
        {(hovered || isActive) && (
          <pointLight
            position={[0, 0, 0.8]}
            intensity={isActive ? 1.6 : 0.8}
            distance={4}
            color={artwork.accentColor || '#c5a059'}
          />
        )}
      </group>

      {/* Museum Brass Plaque Underneath */}
      <group position={[0, -outerHeight / 2 - 0.32, 0.02]}>
        <mesh receiveShadow>
          <boxGeometry args={[Math.min(outerWidth * 0.75, 1.8), 0.32, 0.03]} />
          <meshStandardMaterial
            color={isActive ? '#2a2418' : '#181716'}
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>

        {/* Plaque Title */}
        <Text
          position={[0, 0.06, 0.022]}
          fontSize={0.075}
          maxWidth={1.6}
          textAlign="center"
          color={isActive ? '#e6ca85' : '#d4d4d8'}
          letterSpacing={0.06}
          anchorX="center"
          anchorY="middle"
        >
          {artwork.title.length > 28 ? artwork.title.slice(0, 26) + '...' : artwork.title}
        </Text>

        {/* Plaque Medium & Year */}
        <Text
          position={[0, -0.06, 0.022]}
          fontSize={0.05}
          color="#8b8a91"
          anchorX="center"
          anchorY="middle"
        >
          {artwork.year} • {artwork.categoryName}
        </Text>
      </group>
    </group>
  );
}
