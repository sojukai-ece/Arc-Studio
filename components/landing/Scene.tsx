'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Microchip } from './models/Microchip';

// Global scroll progress store
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

// Modified Particles to act as Neon Exhaust trailing the car
function ExhaustParticles() {
  const pointsRef = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);

  const { geometry, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Start clustered near the exhaust
      positions[i * 3] = (Math.random() - 0.5) * 0.8; // X (width)
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2; // Y (height)
      positions[i * 3 + 2] = Math.random() * -0.5; // Z (depth - backwards)
      
      // Move backwards (negative Z) and slightly outwards
      velocities[i * 3] = (Math.random() - 0.5) * 0.005; // X spread
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005; // Y spread
      velocities[i * 3 + 2] = -(Math.random() * 0.01 + 0.005); // Z blast
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, velocities };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const t = getScrollT();
    
    // Exhaust intensifies as you scroll (accelerate)
    const opacity = Math.max(0.2, t * 2);
    if (matRef.current) matRef.current.opacity = opacity;

    const pos = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2] * (1 + t * 2); // Speed up based on scroll

      // Reset particles when they go too far back
      if (pos[i * 3 + 2] < -2.0) {
        pos[i * 3] = (Math.random() - 0.5) * 0.6;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
        pos[i * 3 + 2] = 0;
      }
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={matRef}
        color="#00E5FF"
        size={0.03}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneContent() {
  const carRef = useRef<THREE.Group>(null!);
  const chipRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = getScrollT();
    const elapsed = state.clock.getElapsedTime();

    // Lamborghini Animations
    if (carRef.current) {
      // Engine Rumble (High frequency Y-axis vibration)
      const rumble = Math.sin(elapsed * 30) * 0.003;
      
      // Base Y position is -0.3, plus rumble, plus slight lift on scroll
      carRef.current.position.y = -0.3 + rumble + (t * 0.2);
      
      // Drives forward (Z axis) towards camera as you scroll
      carRef.current.position.z = -1 + (t * 4);

      // 360 Spin: Starts at angle, does a cinematic spin to show off the geometry
      carRef.current.rotation.y = (t * Math.PI * 2) + 0.4;

      // Dynamic tilt/pitch for cornering effect
      carRef.current.rotation.x = t * 0.15; // Noses up slightly
      carRef.current.rotation.z = Math.sin(t * Math.PI) * -0.15; // Leans into the curve

      // Fade out car near the very end of scroll to make way for Microchip
      carRef.current.visible = t < 0.9;
    }

    // Microchip fades in at 75%+ scroll
    if (chipRef.current) {
      const chipT = Math.max(0, (t - 0.75) * 6);
      chipRef.current.visible = chipT > 0.01;
      const s = THREE.MathUtils.lerp(0.5, 1.0, Math.min(1, chipT));
      chipRef.current.scale.setScalar(s);
    }
  });

  // Cyberpunk Car Materials
  const mats = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ color: '#050505', metalness: 0.9, roughness: 0.2 }),
    glass: new THREE.MeshStandardMaterial({ color: '#000000', metalness: 1.0, roughness: 0.0 }),
    tire: new THREE.MeshStandardMaterial({ color: '#0A0A0A', roughness: 0.9 }),
    rim: new THREE.MeshStandardMaterial({ color: '#1C1C1E', metalness: 0.8, roughness: 0.2 }),
    headlight: new THREE.MeshStandardMaterial({ color: '#003344', emissive: '#00E5FF', emissiveIntensity: 4 }),
    taillight: new THREE.MeshStandardMaterial({ color: '#220033', emissive: '#7B2CBF', emissiveIntensity: 5 }),
  }), []);

  return (
    <>
      {/* Lighting tailored for aggressive car reflections */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" castShadow />
      <pointLight position={[0, 2, 4]} intensity={3} color="#00E5FF" distance={10} />
      <pointLight position={[0, 2, -4]} intensity={4} color="#7B2CBF" distance={10} />

      {/* === LAMBORGHINI AVENTADOR (Quantized Version) === */}
      <group ref={carRef} scale={0.8}>
        
        {/* Main Chassis */}
        <mesh position={[0, 0.2, 0]} material={mats.body} castShadow>
          <boxGeometry args={[1.8, 0.2, 3.8]} />
        </mesh>

        {/* Front Nose */}
        <mesh position={[0, 0.15, 2.1]} rotation={[Math.PI / 12, 0, 0]} material={mats.body}>
          <boxGeometry args={[1.7, 0.2, 1.2]} />
        </mesh>

        {/* Cabin / Roof */}
        <mesh position={[0, 0.5, 0.2]} rotation={[Math.PI / 16, 0, 0]} material={mats.body}>
          <boxGeometry args={[1.3, 0.35, 2.0]} />
        </mesh>
        
        {/* Windshield */}
        <mesh position={[0, 0.55, 1.0]} rotation={[Math.PI / 5, 0, 0]} material={mats.glass}>
          <boxGeometry args={[1.2, 0.7, 0.05]} />
        </mesh>

        {/* Side Windows */}
        <mesh position={[0.66, 0.5, 0.2]} material={mats.glass}>
          <boxGeometry args={[0.02, 0.25, 1.0]} />
        </mesh>
        <mesh position={[-0.66, 0.5, 0.2]} material={mats.glass}>
          <boxGeometry args={[0.02, 0.25, 1.0]} />
        </mesh>

        {/* Rear Engine Deck */}
        <mesh position={[0, 0.45, -1.2]} rotation={[-Math.PI / 16, 0, 0]} material={mats.body}>
          <boxGeometry args={[1.3, 0.15, 1.4]} />
        </mesh>
        {/* Glowing Engine Bay */}
        <mesh position={[0, 0.44, -1.2]} rotation={[-Math.PI / 16, 0, 0]} material={mats.headlight}>
          <boxGeometry args={[0.7, 0.16, 0.9]} />
        </mesh>

        {/* Headlights (Cyan Neon Y-shape abstraction) */}
        <mesh position={[0.7, 0.25, 2.4]} rotation={[0, -Math.PI / 8, 0]} material={mats.headlight}>
          <boxGeometry args={[0.25, 0.02, 0.3]} />
        </mesh>
        <mesh position={[-0.7, 0.25, 2.4]} rotation={[0, Math.PI / 8, 0]} material={mats.headlight}>
          <boxGeometry args={[0.25, 0.02, 0.3]} />
        </mesh>

        {/* Taillights (Purple Neon) */}
        <mesh position={[0.6, 0.3, -1.9]} material={mats.taillight}>
          <boxGeometry args={[0.5, 0.04, 0.1]} />
        </mesh>
        <mesh position={[-0.6, 0.3, -1.9]} material={mats.taillight}>
          <boxGeometry args={[0.5, 0.04, 0.1]} />
        </mesh>

        {/* Wheels (Cylinders rotated on Z axis) */}
        {/* Front Left */}
        <mesh position={[0.9, 0.1, 1.2]} rotation={[0, 0, Math.PI / 2]} material={mats.tire}>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 32]} />
        </mesh>
        {/* Front Right */}
        <mesh position={[-0.9, 0.1, 1.2]} rotation={[0, 0, Math.PI / 2]} material={mats.tire}>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 32]} />
        </mesh>
        {/* Rear Left (Larger) */}
        <mesh position={[0.95, 0.15, -1.2]} rotation={[0, 0, Math.PI / 2]} material={mats.tire}>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
        </mesh>
        {/* Rear Right */}
        <mesh position={[-0.95, 0.15, -1.2]} rotation={[0, 0, Math.PI / 2]} material={mats.tire}>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
        </mesh>

        {/* Rims */}
        <mesh position={[1.03, 0.1, 1.2]} rotation={[0, 0, Math.PI / 2]} material={mats.rim}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
        </mesh>
        <mesh position={[-1.03, 0.1, 1.2]} rotation={[0, 0, Math.PI / 2]} material={mats.rim}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
        </mesh>
        <mesh position={[1.11, 0.15, -1.2]} rotation={[0, 0, Math.PI / 2]} material={mats.rim}>
          <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
        </mesh>
        <mesh position={[-1.11, 0.15, -1.2]} rotation={[0, 0, Math.PI / 2]} material={mats.rim}>
          <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
        </mesh>

        {/* Exhaust Particles (Shooting out the back) */}
        <group position={[0, 0.1, -2.0]}>
          <ExhaustParticles />
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
      camera={{ position: [0, 1.2, 4.5], fov: 40 }}
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