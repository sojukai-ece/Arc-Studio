'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataParticlesProps {
  count?: number;
}

export function DataParticles({ count = 120 }: DataParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);

  const { geometry, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 1] = Math.random() * 0.5;
      positions[i * 3 + 2] = Math.random() * 1.2;
      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = Math.random() * 0.003 + 0.001;
      velocities[i * 3 + 2] = Math.random() * 0.002;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, velocities };
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];
      if (pos[i * 3 + 1] > 1.4) {
        pos[i * 3 + 1] = 0;
        pos[i * 3] = (Math.random() - 0.5) * 0.8;
        pos[i * 3 + 2] = Math.random() * 1.0;
      }
      if (Math.abs(pos[i * 3]) > 0.6) velocities[i * 3] *= -0.8;
      if (pos[i * 3 + 2] < 0 || pos[i * 3 + 2] > 1.4) velocities[i * 3 + 2] *= -1;
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        ref={matRef}
        color="#00E5FF"
        size={0.018}
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
