'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring, useMotionValueEvent } from 'framer-motion';

const cloudinaryVideoUrl = process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO;

export function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Create a smoothed version of the scroll progress for a "premium" feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Synchronize video currentTime with the smoothed scroll progress
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const video = videoRef.current;
    if (!video || !video.duration || video.duration === Infinity) return;

    const targetTime = latest * video.duration;
    
    // We update currentTime to match the scroll progress.
    // Modern browsers handle frequent currentTime updates well if the video is buffered.
    if (Number.isFinite(targetTime)) {
      video.currentTime = targetTime;
    }
  });

  // Handle initial sync and metadata loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncInitialTime = () => {
      if (video.duration && Number.isFinite(video.duration)) {
        video.currentTime = scrollYProgress.get() * video.duration;
      }
    };

    if (video.readyState >= 1) {
      syncInitialTime();
    }

    video.addEventListener('loadedmetadata', syncInitialTime);
    return () => video.removeEventListener('loadedmetadata', syncInitialTime);
  }, [scrollYProgress]);

  if (!cloudinaryVideoUrl) return <div className="video-fallback" aria-hidden="true" />;

  return (
    <div className={`video-background ${isReady ? 'is-ready' : ''}`} aria-hidden="true">
      <video
        ref={videoRef}
        className="video-background__media"
        src={cloudinaryVideoUrl}
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setIsReady(true)}
      />
      <div className="video-background__veil" />
      <div className="video-background__grain" />
    </div>
  );
}

