'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
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

function VideoSceneContent() {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null!);
  const chipRef = useRef<THREE.Group>(null!);

  const video = useMemo(() => {
    const vid = document.createElement('video');
    vid.src = '/bmwmontage.mp4'; 
    vid.preload = 'auto';
    vid.muted = true;
    vid.playsInline = true;
    vid.loop = false;
    vid.load();
    return vid;
  }, []);

  const videoTexture = useMemo(() => {
    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [video]);

  const videoAspect = 16 / 9; 
  const screenAspect = viewport.width / viewport.height;

  let planeScale: [number, number, number] = [1, 1, 1];

  if (screenAspect > videoAspect) {
    planeScale = [viewport.width, viewport.width / videoAspect, 1];
  } else {
    planeScale = [viewport.height * videoAspect, viewport.height, 1];
  }

  useFrame((state) => {
    const t = getScrollT();

    if (video.duration) {
      const targetTime = t * video.duration;
      video.currentTime = THREE.MathUtils.lerp(video.currentTime, targetTime, 0.1);
    }

    if (chipRef.current) {
      const chipT = Math.max(0, (t - 0.75) * 6);
      chipRef.current.visible = chipT > 0.01;
      
      const s = THREE.MathUtils.lerp(0.1, 0.35, Math.min(1, chipT));
      chipRef.current.scale.setScalar(s);

      // FIX: Adjusted from 0.65 to 0.55 to pull the chip to the left and avoid cutoff
      const rightEdgeOffset = (viewport.width / 2) * 0.55;
      const bottomEdgeOffset = -(viewport.height / 2) * 0.4;
      
      chipRef.current.position.x = rightEdgeOffset;
      chipRef.current.position.y = bottomEdgeOffset + (Math.sin(state.clock.elapsedTime * 2) * 0.04);
      chipRef.current.position.z = 1.0;

      chipRef.current.rotation.x = 0.6 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      chipRef.current.rotation.y = -Math.PI / 4 + Math.cos(state.clock.elapsedTime * 1.2) * 0.05;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={planeScale}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={videoTexture} toneMapped={false} />
      </mesh>

      <group 
        ref={chipRef} 
        visible={false}
      >
        <Microchip />
      </group>
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
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
        <VideoSceneContent />
      </Suspense>
    </Canvas>
  );
}