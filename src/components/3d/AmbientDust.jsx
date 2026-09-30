import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AmbientDust({ count = 350 }) {
  const pointsRef = useRef();

  const [positions, scales, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    const spd = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Scatter in a studio volume: width 35, height 12, depth 25
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = Math.random() * 12 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 26;

      sca[i] = Math.random() * 0.08 + 0.02;

      // Drifting speeds
      spd[i * 3] = (Math.random() - 0.5) * 0.003;
      spd[i * 3 + 1] = Math.random() * 0.004 + 0.001;
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    return [pos, sca, spd];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArray = posAttr.array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Drift slightly
      posArray[idx] += speeds[idx];
      posArray[idx + 1] += speeds[idx + 1];
      posArray[idx + 2] += speeds[idx + 2];

      // Recycle particles when they float too high or drift too far
      if (posArray[idx + 1] > 9) {
        posArray[idx + 1] = -2;
        posArray[idx] = (Math.random() - 0.5) * 36;
        posArray[idx + 2] = (Math.random() - 0.5) * 26;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#e6d5b8"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
