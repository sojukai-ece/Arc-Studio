'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useRef, useMemo, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Microchip } from './models/Microchip';

// Global scroll progress store — set up once outside React
if (typeof window !== 'undefined') {
  window.addEventListener(
    'scroll',
    () => {
      (window as unknown as { _arcScrollY: number })._arcScrollY = window.scrollY;
      (window as unknown as { _arcScrollMax: number })._arcScrollMax =
        document.body.scrollHeight - window.innerHeight;
    },
    { passive: true }
  );
}

function getScrollT(): number {
  if (typeof window === 'undefined') return 0;
  const y = (window as unknown as { _arcScrollY?: number })._arcScrollY ?? 0;
  const max = (window as unknown as { _arcScrollMax?: number })._arcScrollMax ?? 1;
  return Math.min(1, y / Math.max(1, max));
}

const PARTICLE_COUNT = 150;

function Particles() {
  const pointsRef = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);

  const { geometry, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 1] = Math.random() * 0.5;
      positions[i * 3 + 2] = Math.random() * 1.0;
      velocities[i * 3] = (Math.random() - 0.5) * 0.0018;
      velocities[i * 3 + 1] = Math.random() * 0.0025 + 0.001;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0015;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, velocities };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const t = getScrollT();
    const opacity = Math.max(0, Math.min(1, t * 4 - 0.2));
    pointsRef.current.visible = opacity > 0.01;
    if (matRef.current) matRef.current.opacity = opacity;

    const pos = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];
      if (pos[i * 3 + 1] > 1.2) {
        pos[i * 3 + 1] = 0;
        pos[i * 3] = (Math.random() - 0.5) * 0.8;
        pos[i * 3 + 2] = Math.random() * 0.9;
      }
      if (Math.abs(pos[i * 3]) > 0.55) velocities[i * 3] *= -0.9;
      if (pos[i * 3 + 2] < 0 || pos[i * 3 + 2] > 1.2) velocities[i * 3 + 2] *= -1;
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} visible={false}>
      <pointsMaterial
        ref={matRef}
        color="#00E5FF"
        size={0.016}
        transparent
        opacity={0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneContent() {
  const laptopRef = useRef<THREE.Group>(null!);
  const chipRef = useRef<THREE.Group>(null!);
  const hingeRef = useRef<THREE.Group>(null!);
  const screenMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const screenGlowMatRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((state) => {
    const t = getScrollT();
    const elapsed = state.clock.getElapsedTime();

    // Laptop hover + fade
    if (laptopRef.current) {
      laptopRef.current.position.y = Math.sin(elapsed * 0.7) * 0.06;
      laptopRef.current.rotation.y = Math.sin(elapsed * 0.25) * 0.08 + t * 0.3;
      laptopRef.current.visible = t < 0.85;
    }

    // Lid/hinge opening — first 35% of scroll
    if (hingeRef.current) {
      hingeRef.current.rotation.x = THREE.MathUtils.lerp(
        -Math.PI * 0.02,      // open
        -Math.PI * 0.55,       // closed
        Math.max(0, 1 - t * 2.8)
      );
    }

    // Screen emissive glow
    if (screenMatRef.current) {
      screenMatRef.current.emissiveIntensity = Math.min(1, t * 3) * 1.8;
    }
    if (screenGlowMatRef.current) {
      screenGlowMatRef.current.emissiveIntensity = 0.15 + Math.min(1, t * 3) * 0.6;
    }

    // Microchip fades in at 75%+ scroll
    if (chipRef.current) {
      const chipT = Math.max(0, (t - 0.75) * 6);
      chipRef.current.visible = chipT > 0.01;
      const s = THREE.MathUtils.lerp(0.5, 1.0, Math.min(1, chipT));
      chipRef.current.scale.setScalar(s);
    }
  });

  // Materials created once
  const mats = useMemo(() => ({
    base: new THREE.MeshStandardMaterial({ color: '#1C1C1E', metalness: 0.9, roughness: 0.15 }),
    edge: new THREE.MeshStandardMaterial({ color: '#2A2A2C', metalness: 0.95, roughness: 0.1 }),
    kb: new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0.5, roughness: 0.6 }),
    track: new THREE.MeshStandardMaterial({ color: '#1E1E20', metalness: 0.8, roughness: 0.2 }),
    bezel: new THREE.MeshStandardMaterial({ color: '#0A0A0A', metalness: 0.3, roughness: 0.8 }),
    logo: new THREE.MeshStandardMaterial({ color: '#2A2A2C', metalness: 0.9, roughness: 0.1 }),
  }), []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={1.8} color="#ffffff" />
      <pointLight position={[-3, 2, -2]} intensity={1.0} color="#7B2CBF" />
      <pointLight position={[0, 0, 4]} intensity={1.4} color="#00E5FF" />
      <pointLight position={[0, -2, 0]} intensity={0.4} color="#00E5FF" />

      {/* === LAPTOP === */}
      <group ref={laptopRef} position={[0.5, 0, 0]} scale={1.05}>
        {/* Base */}
        <group position={[0, -0.04, 0]}>
          <mesh material={mats.base} castShadow>
            <boxGeometry args={[2.0, 0.06, 1.35]} />
          </mesh>
          <mesh position={[0, -0.04, 0]} material={mats.edge}>
            <boxGeometry args={[1.98, 0.02, 1.33]} />
          </mesh>
          <mesh position={[0, 0.035, 0.05]} material={mats.kb}>
            <boxGeometry args={[1.7, 0.005, 1.0]} />
          </mesh>
          <mesh position={[0, 0.034, 0.45]} material={mats.track}>
            <boxGeometry args={[0.55, 0.004, 0.32]} />
          </mesh>
          <mesh position={[0, 0.05, -0.635]} rotation={[0, 0, Math.PI / 2]} material={mats.edge}>
            <cylinderGeometry args={[0.03, 0.03, 1.9, 16]} />
          </mesh>
        </group>

        {/* Lid */}
        <group ref={hingeRef} position={[0, -0.01, -0.635]}>
          <mesh position={[0, 0, 0.635]} material={mats.base} castShadow>
            <boxGeometry args={[2.0, 0.04, 1.35]} />
          </mesh>
          <mesh position={[0, 0.022, 0.635]} material={mats.bezel}>
            <boxGeometry args={[1.85, 0.005, 1.22]} />
          </mesh>
          {/* Screen */}
          <mesh position={[0, 0.026, 0.63]}>
            <boxGeometry args={[1.72, 0.004, 1.1]} />
            <meshStandardMaterial
              ref={screenMatRef}
              color="#001a20"
              emissive="#00E5FF"
              emissiveIntensity={0}
              metalness={0.1}
              roughness={0.5}
            />
          </mesh>
          {/* Screen inner glow */}
          <mesh position={[0, 0.028, 0.63]}>
            <boxGeometry args={[1.68, 0.002, 1.06]} />
            <meshStandardMaterial
              ref={screenGlowMatRef}
              color="#003344"
              emissive="#00E5FF"
              emissiveIntensity={0.15}
              transparent
              opacity={0.6}
            />
          </mesh>
          <mesh position={[0, -0.022, 0.63]} material={mats.logo}>
            <circleGeometry args={[0.12, 32]} />
          </mesh>
          {/* Particles — positioned relative to lid/screen */}
          <group position={[0, 0.1, 0.38]}>
            <Particles />
          </group>
        </group>
      </group>

      {/* === MICROCHIP (footer) === */}
      <group ref={chipRef} position={[0, 0, 0]} visible={false}>
        <Microchip />
      </group>
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0.7, 3.8], fov: 40 }}
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
      <Suspense fallback={null}>
        <Environment preset="city" />
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
