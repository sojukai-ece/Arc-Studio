'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useScroll, useSpring, useMotionValueEvent } from 'framer-motion';

const cloudinaryVideoUrl = process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO;
const MIN_SEEK_INTERVAL = 1 / 30;

export function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pendingTimeRef = useRef<number | null>(null);
  const lastSeekTimeRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Create a smoothed version of the scroll progress for a "premium" feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Browsers cannot reliably decode a new video frame for every scroll event.
  // Batch updates into animation frames and skip imperceptibly small seeks.
  const queueSeek = useCallback((progress: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    pendingTimeRef.current = progress * video.duration;
    if (animationFrameRef.current !== null) return;

    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = null;
      const targetTime = pendingTimeRef.current;
      pendingTimeRef.current = null;

      if (targetTime === null || !videoRef.current || !Number.isFinite(targetTime)) return;
      if (
        lastSeekTimeRef.current !== null &&
        Math.abs(targetTime - lastSeekTimeRef.current) < MIN_SEEK_INTERVAL
      ) {
        return;
      }

      videoRef.current.currentTime = targetTime;
      lastSeekTimeRef.current = targetTime;
    });
  }, []);

  // Synchronize video currentTime with the smoothed scroll progress.
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    queueSeek(latest);
  });

  // Handle initial sync and metadata loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncInitialTime = () => {
      if (video.duration && Number.isFinite(video.duration)) {
        const initialTime = scrollYProgress.get() * video.duration;
        video.currentTime = initialTime;
        lastSeekTimeRef.current = initialTime;
      }
    };

    if (video.readyState >= 1) {
      syncInitialTime();
    }

    video.addEventListener('loadedmetadata', syncInitialTime);
    return () => {
      video.removeEventListener('loadedmetadata', syncInitialTime);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
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
