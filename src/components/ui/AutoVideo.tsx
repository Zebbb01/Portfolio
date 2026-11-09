'use client';

// A muted, looping video that starts by itself only for people who have not asked
// their system to reduce motion.
import { useEffect, useRef, type VideoHTMLAttributes } from 'react';

export default function AutoVideo(props: VideoHTMLAttributes<HTMLVideoElement>) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.current?.play().catch(() => {});
  }, []);

  return <video ref={video} muted loop playsInline preload="metadata" {...props} />;
}
