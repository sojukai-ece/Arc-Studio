'use client';

import { useEffect, useRef, useState } from 'react';

const cloudinaryVideoUrl = process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_URL;

export function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrame = 0;
    const syncVideoToScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const targetTime = progress * video.duration;

      if (Number.isFinite(targetTime) && Math.abs(video.currentTime - targetTime) > 0.08) {
        video.currentTime = targetTime;
      }
    };
    const requestSync = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(syncVideoToScroll);
    };

    video.addEventListener('loadedmetadata', requestSync);
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync);
    return () => {
      cancelAnimationFrame(animationFrame);
      video.removeEventListener('loadedmetadata', requestSync);
      window.removeEventListener('scroll', requestSync);
      window.removeEventListener('resize', requestSync);
    };
  }, []);

  if (!cloudinaryVideoUrl) return <div className="video-fallback" aria-hidden="true" />;

  return (
    <div className={`video-background ${isReady ? 'is-ready' : ''}`} aria-hidden="true">
      <video
        ref={videoRef}
        className="video-background__media"
        src={cloudinaryVideoUrl}
        muted
        playsInline
        preload="metadata"
        onCanPlay={() => setIsReady(true)}
      />
      <div className="video-background__veil" />
      <div className="video-background__grain" />
    </div>
  );
}
