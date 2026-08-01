'use client';

import { Canvas } from '@react-three/fiber';
import { ScrollControls, Environment } from '@react-three/drei';
import { Laptop } from './models/Laptop';
import { Microchip } from './models/Microchip';
import { useScroll } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SceneContent() {
  const scrollData = useScroll();
  const laptopGroupRef = useRef<THREE.Group>(null!);
  const microchipGroupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    const t = scrollData.offset;

    // Laptop: visible hero → value props, fades out mid-scroll
    if (laptopGroupRef.current) {
      const opacity = t < 0.5 ? 1 : Math.max(0, 1 - (t - 0.5) * 6);
      laptopGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(0.9, 1.15, Math.min(1, t * 2))
      );
      laptopGroupRef.current.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat && mat.transparent !== undefined) {
            mat.transparent = true;
            mat.opacity = opacity;
          }
        }
      });
    }

    // Microchip: fades in near the bottom
    if (microchipGroupRef.current) {
      const chipVisible = Math.max(0, (t - 0.75) * 6);
      microchipGroupRef.current.visible = chipVisible > 0.01;
      microchipGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(0.6, 1.0, Math.min(1, chipVisible))
      );
    }
  });

  return (
    <>
      <group ref={laptopGroupRef} position={[0, 0, 0]}>
        <Laptop />
      </group>
      <group ref={microchipGroupRef} position={[0, -0.2, 0]} visible={false}>
        <Microchip />
      </group>
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0.8, 3.5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <ScrollControls pages={4} damping={0.1}>
        <Environment preset="city" />
        <SceneContent />
      </ScrollControls>
    </Canvas>
  );
}
