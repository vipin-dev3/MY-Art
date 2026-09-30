import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ArtFrame from './ArtFrame';

export default function GalleryCarousel({
  artworks = [],
  activeIndex = 0,
  onSelectArtwork,
  onInspectArtwork,
}) {
  const carouselGroupRef = useRef();
  const currentAngleRef = useRef(0);

  const count = artworks.length;
  // Arc spacing between frames (in radians)
  // For 8-12 items, ~0.42 to 0.48 rad creates a gorgeous sweeping gallery wall
  const angleStep = Math.min(0.48, (Math.PI * 1.6) / Math.max(count, 6));
  const radius = 9.8;

  // Animate carousel rotation smoothly to active index
  useFrame((state, delta) => {
    if (!carouselGroupRef.current) return;

    const targetAngle = activeIndex * angleStep;
    // Smooth lerp damping
    currentAngleRef.current = THREE.MathUtils.lerp(
      currentAngleRef.current,
      targetAngle,
      0.06
    );

    // Apply rotation around the pivot
    carouselGroupRef.current.rotation.y = currentAngleRef.current;
  });

  return (
    // Pivot positioned at center of radius
    <group position={[0, 0, -radius]}>
      <group ref={carouselGroupRef}>
        {artworks.map((artwork, index) => {
          const frameAngle = -index * angleStep;
          const x = Math.sin(frameAngle) * radius;
          const z = Math.cos(frameAngle) * radius;
          const rotY = frameAngle;

          const isActive = index === activeIndex;

          return (
            <ArtFrame
              key={artwork.id}
              artwork={artwork}
              position={[x, 0, z]}
              rotation={[0, rotY, 0]}
              isActive={isActive}
              onSelect={() => onSelectArtwork(artwork, index)}
              onInspect={() => onInspectArtwork(artwork)}
            />
          );
        })}
      </group>
    </group>
  );
}
