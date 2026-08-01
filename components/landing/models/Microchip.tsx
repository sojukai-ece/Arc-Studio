'use client';

import { useRef } from 'react';
import type { ReactElement } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Microchip() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.4;
    groupRef.current.rotation.x = Math.sin(t * 0.25) * 0.15;
  });

  const chipMat = new THREE.MeshStandardMaterial({
    color: '#1A1A2E',
    metalness: 0.8,
    roughness: 0.3,
  });

  const traceMat = new THREE.MeshStandardMaterial({
    color: '#00E5FF',
    emissive: '#00E5FF',
    emissiveIntensity: 1.2,
    metalness: 0.5,
    roughness: 0.1,
  });

  const pinMat = new THREE.MeshStandardMaterial({
    color: '#C0A060',
    metalness: 0.95,
    roughness: 0.05,
  });

  // Generate pin positions for all 4 sides
  const pinCount = 8;
  const pinSpacing = 0.12;
  const chipSize = 0.55;

  const pins: ReactElement[] = [];
  for (let i = 0; i < pinCount; i++) {
    const offset = (i - (pinCount - 1) / 2) * pinSpacing;
    // Bottom pins
    pins.push(
      <mesh key={`b${i}`} position={[offset, 0, chipSize + 0.09]} material={pinMat}>
        <boxGeometry args={[0.03, 0.025, 0.18]} />
      </mesh>
    );
    // Top pins
    pins.push(
      <mesh key={`t${i}`} position={[offset, 0, -chipSize - 0.09]} material={pinMat}>
        <boxGeometry args={[0.03, 0.025, 0.18]} />
      </mesh>
    );
    // Left pins
    pins.push(
      <mesh key={`l${i}`} position={[-chipSize - 0.09, 0, offset]} material={pinMat}>
        <boxGeometry args={[0.18, 0.025, 0.03]} />
      </mesh>
    );
    // Right pins
    pins.push(
      <mesh key={`r${i}`} position={[chipSize + 0.09, 0, offset]} material={pinMat}>
        <boxGeometry args={[0.18, 0.025, 0.03]} />
      </mesh>
    );
  }

  // Trace lines on top of chip
  const traceLines = [
    { pos: [0.2, 0.051, 0] as [number, number, number], args: [0.02, 0.001, 0.7] as [number, number, number] },
    { pos: [-0.2, 0.051, 0] as [number, number, number], args: [0.02, 0.001, 0.7] as [number, number, number] },
    { pos: [0, 0.051, 0.2] as [number, number, number], args: [0.7, 0.001, 0.02] as [number, number, number] },
    { pos: [0, 0.051, -0.2] as [number, number, number], args: [0.7, 0.001, 0.02] as [number, number, number] },
    { pos: [0.35, 0.051, 0.35] as [number, number, number], args: [0.02, 0.001, 0.3] as [number, number, number] },
    { pos: [-0.35, 0.051, -0.35] as [number, number, number], args: [0.3, 0.001, 0.02] as [number, number, number] },
  ];

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]} intensity={2} color="#00E5FF" />
      <pointLight position={[-2, -1, -2]} intensity={1} color="#7B2CBF" />

      {/* Main chip body */}
      <mesh material={chipMat} castShadow>
        <boxGeometry args={[1.1, 0.1, 1.1]} />
      </mesh>

      {/* Chamfered edge highlight */}
      <mesh material={new THREE.MeshStandardMaterial({ color: '#252540', metalness: 0.9, roughness: 0.1 })}>
        <boxGeometry args={[1.06, 0.11, 1.06]} />
      </mesh>
      <mesh material={chipMat}>
        <boxGeometry args={[1.08, 0.09, 1.08]} />
      </mesh>

      {/* Inner die area */}
      <mesh position={[0, 0.055, 0]} material={new THREE.MeshStandardMaterial({ color: '#0D0D1A', metalness: 0.4, roughness: 0.6 })}>
        <boxGeometry args={[0.72, 0.004, 0.72]} />
      </mesh>

      {/* Arc.Studio logo text "ARC" as extruded shapes approximated with boxes */}
      <mesh position={[-0.12, 0.058, 0]} material={traceMat}>
        <boxGeometry args={[0.05, 0.002, 0.22]} />
      </mesh>
      <mesh position={[-0.07, 0.058, -0.1]} material={traceMat}>
        <boxGeometry args={[0.1, 0.002, 0.04]} />
      </mesh>
      <mesh position={[-0.07, 0.058, 0.1]} material={traceMat}>
        <boxGeometry args={[0.1, 0.002, 0.04]} />
      </mesh>
      <mesh position={[0.02, 0.058, 0]} material={traceMat}>
        <boxGeometry args={[0.04, 0.002, 0.22]} />
      </mesh>
      <mesh position={[0.12, 0.058, 0]} material={traceMat}>
        <cylinderGeometry args={[0.09, 0.09, 0.002, 16, 1, false, 0, Math.PI]} />
      </mesh>

      {/* Circuit trace lines */}
      {traceLines.map((tl, i) => (
        <mesh key={i} position={tl.pos} material={traceMat}>
          <boxGeometry args={tl.args} />
        </mesh>
      ))}

      {/* Corner markers */}
      {[[-0.45, 0.052, -0.45], [0.45, 0.052, -0.45], [-0.45, 0.052, 0.45], [0.45, 0.052, 0.45]].map((p, i) => (
        <mesh key={`corner${i}`} position={p as [number, number, number]} material={traceMat}>
          <boxGeometry args={[0.06, 0.003, 0.06]} />
        </mesh>
      ))}

      {/* Pins */}
      {pins}
    </group>
  );
}