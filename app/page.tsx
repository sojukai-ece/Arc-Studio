'use client';

import { Overlay } from '@/components/landing/Overlay';
import { ScrollVideoBackground } from '@/components/landing/ScrollVideoBackground';

export default function Home() {
  return (
    <>
      <ScrollVideoBackground />
      <Overlay />
    </>
  );
}
