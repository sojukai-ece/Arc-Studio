'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { DataParticles } from './DataParticles';

export function Laptop() {
  const scrollData = useScroll();
  const hingeRef = useRef<THREE.Group>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const screenGlowRef = useRef<THREE.MeshStandardMaterial>(null!);
  const particleOpacity = useRef(0);

  useFrame((state) => {
    const t = scrollData.offset; // 0 → 1 as user scrolls
    const elapsed = state.clock.getElapsedTime();

    // Hover float animation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(elapsed * 0.7) * 0.06;
      groupRef.current.rotation.y = Math.sin(elapsed * 0.3) * 0.05 + (t * 0.2);
    }

    // Hinge: opens from -Math.PI*0.5 (closed) to 0 (open ~110°)
    if (hingeRef.current) {
      const openAngle = -Math.PI * 0.55;
      hingeRef.current.rotation.x = THREE.MathUtils.lerp(
        -Math.PI * 0.02, // fully open
        openAngle,       // fully closed
        Math.max(0, 1 - t * 3) // opens in first 33% of scroll
      );
    }

    // Screen glow intensifies as laptop opens
    if (screenGlowRef.current) {
      const glowIntensity = Math.min(1, t * 4);
      screenGlowRef.current.emissiveIntensity = glowIntensity * 1.5;
    }

    // Particle opacity tied to screen opening
    particleOpacity.current = Math.min(1, Math.max(0, (t * 5) - 0.2));
  });

  const baseMaterial = new THREE.MeshStandardMaterial({
    color: '#1C1C1E',
    metalness: 0.9,
    roughness: 0.15,
    envMapIntensity: 1.2,
  });

  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: '#2A2A2C',
    metalness: 0.95,
    roughness: 0.1,
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.1}>
      {/* Ambient + Point Lights for 3D model */}
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-2, 2, -2]} intensity={0.8} color="#7B2CBF" />
      <pointLight position={[0, 0, 3]} intensity={1.2} color="#00E5FF" />

      {/* Base / Bottom of laptop */}
      <group position={[0, -0.04, 0]}>
        {/* Main base body */}
        <mesh material={baseMaterial} castShadow>
          <boxGeometry args={[2.0, 0.06, 1.35]} />
        </mesh>
        {/* Bottom edge bevel */}
        <mesh position={[0, -0.04, 0]} material={edgeMaterial}>
          <boxGeometry args={[1.98, 0.02, 1.33]} />
        </mesh>
        {/* Keyboard area recess */}
        <mesh position={[0, 0.035, 0.05]} material={new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0.5, roughness: 0.6 })}>
          <boxGeometry args={[1.7, 0.005, 1.0]} />
        </mesh>
        {/* Trackpad */}
        <mesh position={[0, 0.034, 0.45]} material={new THREE.MeshStandardMaterial({ color: '#1E1E20', metalness: 0.8, roughness: 0.2 })}>
          <boxGeometry args={[0.55, 0.004, 0.32]} />
        </mesh>
        {/* Hinge cylinder */}
        <mesh position={[0, 0.05, -0.635]} rotation={[0, 0, Math.PI / 2]} material={edgeMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 1.9, 16]} />
        </mesh>
      </group>

      {/* Lid / Screen assembly — pivots from rear edge */}
      <group ref={hingeRef} position={[0, -0.01, -0.635]}>
        {/* Lid body */}
        <mesh
          position={[0, 0, 0.635]}
          material={baseMaterial}
          castShadow
        >
          <boxGeometry args={[2.0, 0.04, 1.35]} />
        </mesh>
        {/* Screen bezel (inset dark frame) */}
        <mesh
          position={[0, 0.022, 0.635]}
          material={new THREE.MeshStandardMaterial({ color: '#0A0A0A', metalness: 0.3, roughness: 0.8 })}
        >
          <boxGeometry args={[1.85, 0.005, 1.22]} />
        </mesh>
        {/* Screen display — emissive glow */}
        <mesh position={[0, 0.026, 0.63]}>
          <boxGeometry args={[1.72, 0.004, 1.1]} />
          <meshStandardMaterial
            ref={screenGlowRef}
            color="#001a20"
            emissive="#00E5FF"
            emissiveIntensity={0}
            metalness={0.1}
            roughness={0.5}
          />
        </mesh>
        {/* Screen inner glow ring */}
        <mesh position={[0, 0.028, 0.63]}>
          <boxGeometry args={[1.68, 0.002, 1.06]} />
          <meshStandardMaterial
            color="#003344"
            emissive="#00E5FF"
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
        {/* Apple-style logo placeholder on back of lid */}
        <mesh position={[0, -0.022, 0.63]}>
          <circleGeometry args={[0.12, 32]} />
          <meshStandardMaterial color="#2A2A2C" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Data particles — confined to screen projection area */}
        <group position={[0, 0.1, 0.4]}>
          <DataParticles count={140} />
        </group>
      </group>
    </group>
  );
}
