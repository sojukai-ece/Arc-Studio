'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Overlay } from '@/components/landing/Overlay';

// Dynamically import the 3D scene — WebGL must be client-side only
const Scene = dynamic(
  () => import('@/components/landing/Scene').then((m) => m.Scene),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      {/* 3D WebGL Canvas — fixed, behind content */}
      <Suspense fallback={null}>
        <Scene />
      </Suspense>

      {/* DOM Overlay — scrollable page content */}
      <Overlay />
    </>
  );
}