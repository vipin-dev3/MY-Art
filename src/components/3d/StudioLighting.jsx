import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function StudioLighting({ activeArtworkPos = [0, 0, 0], spotlightIntensity = 2.5 }) {
  const spotLightRef = useRef();
  const targetRef = useRef();

  useFrame((state, delta) => {
    if (spotLightRef.current && targetRef.current) {
      // Smoothly interpolate the spotlight target to the active artwork position
      targetRef.current.position.lerp(
        new THREE.Vector3(activeArtworkPos[0], activeArtworkPos[1], activeArtworkPos[2]),
        0.05
      );
      // Smoothly move spotlight source to be positioned in front of and slightly above the active artwork
      const targetSourceX = activeArtworkPos[0] * 0.8;
      const targetSourceZ = activeArtworkPos[2] + 4.5;
      spotLightRef.current.position.x = THREE.MathUtils.lerp(spotLightRef.current.position.x, targetSourceX, 0.05);
      spotLightRef.current.position.z = THREE.MathUtils.lerp(spotLightRef.current.position.z, targetSourceZ, 0.05);
    }
  });

  return (
    <group>
      {/* Target object for the spotlight */}
      <object3D ref={targetRef} position={[0, 0, 0]} />

      {/* Subtle ambient fill - deep studio night */}
      <ambientLight intensity={0.4} color="#353b48" />

      {/* Broad overhead soft studio light */}
      <directionalLight
        position={[0, 10, 5]}
        intensity={0.6}
        color="#f5e6d3"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Focused museum spotlight tracking the active artwork */}
      <spotLight
        ref={spotLightRef}
        position={[0, 6, 6]}
        target={targetRef.current}
        angle={0.55}
        penumbra={0.8}
        intensity={spotlightIntensity}
        color="#fff4e0"
        castShadow
        shadow-bias={-0.0001}
      />

      {/* Warm back rim light for sculptural edge contrast */}
      <pointLight position={[-12, 4, -4]} intensity={0.8} color="#c5a059" distance={25} />
      <pointLight position={[12, 4, -4]} intensity={0.8} color="#93c5fd" distance={25} />

      {/* Studio Floor with satin reflection */}
      <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mirror={0.4}
          mixBlur={0.8}
          mixStrength={1.5}
          roughness={0.65}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0c0d12"
          metalness={0.4}
        />
      </mesh>

      {/* Subtle curved background studio wall */}
      <mesh position={[0, 4, -10]} receiveShadow>
        <planeGeometry args={[120, 24]} />
        <meshStandardMaterial
          color="#070709"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}
