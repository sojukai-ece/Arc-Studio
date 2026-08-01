'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataParticlesProps {
  count?: number;
  opacity?: number;
}

export function DataParticles({ count = 120, opacity = 1 }: DataParticlesProps) {
  const ref = useRef<THREE.Points>(null!);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spawn near screen of laptop (x: -0.4 to 0.4, y: 0 to 0.5, z: 0 to 1.2)
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 1] = Math.random() * 0.5;
      positions[i * 3 + 2] = Math.random() * 1.2;
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = Math.random() * 0.003 + 0.001;
      velocities[i * 3 + 2] = Math.random() * 0.002;
    }
    return { positions, velocities };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] += velocities[i * 3 + 0];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];
      // reset if out of bounds (cloud stays near device)
      if (pos[i * 3 + 1] > 1.4) {
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 0.8;
        pos[i * 3 + 2] = Math.random() * 1.0;
      }
      if (Math.abs(pos[i * 3 + 0]) > 0.6) {
        pos[i * 3 + 0] *= 0.9;
        velocities[i * 3 + 0] *= -0.8;
      }
      if (pos[i * 3 + 2] < 0 || pos[i * 3 + 2] > 1.4) {
        velocities[i * 3 + 2] *= -1;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00E5FF"
        size={0.018}
        transparent
        opacity={opacity * 0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
