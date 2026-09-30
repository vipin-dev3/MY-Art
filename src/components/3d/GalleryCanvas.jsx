import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GalleryCarousel from './GalleryCarousel';
import StudioLighting from './StudioLighting';
import AmbientDust from './AmbientDust';

// Camera controller with subtle physical parallax responding to cursor
function CameraRig({ isInteracting }) {
  useFrame((state) => {
    if (isInteracting) return;
    // Gentle floating camera parallax
    const targetX = state.pointer.x * 0.45;
    const targetY = 0.05 + state.pointer.y * 0.25;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function GalleryCanvas({
  artworks = [],
  activeIndex = 0,
  onSelectArtwork,
  onInspectArtwork,
  onPrev,
  onNext,
}) {
  const [dragStartX, setDragStartX] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Drag swipe handling to switch artworks
  const handlePointerDown = (e) => {
    setDragStartX(e.clientX);
    setIsInteracting(true);
  };

  const handlePointerUp = (e) => {
    if (dragStartX !== null) {
      const deltaX = e.clientX - dragStartX;
      if (deltaX > 60) {
        onPrev?.();
      } else if (deltaX < -60) {
        onNext?.();
      }
    }
    setDragStartX(null);
    setIsInteracting(false);
  };

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        onPrev?.();
      } else if (e.key === 'ArrowRight') {
        onNext?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrev, onNext]);

  return (
    <div
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        setDragStartX(null);
        setIsInteracting(false);
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.05, 4.2], fov: 44, near: 0.1, far: 60 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <color attach="background" args={['#08080a']} />
        <fog attach="fog" args={['#08080a', 10, 24]} />

        {/* Camera Parallax Rig */}
        <CameraRig isInteracting={isInteracting} />

        {/* Studio Lighting & Reflections */}
        <StudioLighting activeArtworkPos={[0, 0, 0]} spotlightIntensity={2.8} />

        {/* Floating Charcoal / Gold Ambient Dust */}
        <AmbientDust count={300} />

        {/* 3D Curved Gallery Carousel */}
        <Suspense fallback={null}>
          <GalleryCarousel
            artworks={artworks}
            activeIndex={activeIndex}
            onSelectArtwork={onSelectArtwork}
            onInspectArtwork={onInspectArtwork}
          />
        </Suspense>
      </Canvas>

      {/* Subtle Studio Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 studio-vignette opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070709] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#070709] to-transparent" />
    </div>
  );
}
