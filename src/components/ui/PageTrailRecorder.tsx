'use client';

// Mounted once in the root layout, so every page the visitor reaches is on the trail.
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordPage } from '@/src/lib/pageTrail';

export default function PageTrailRecorder() {
  const pathname = usePathname();

  useEffect(() => recordPage(pathname), [pathname]);

  return null;
}
