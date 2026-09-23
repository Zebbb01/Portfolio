// src/components/ui/PointerSpotlight.tsx
'use client';

import { useEffect } from 'react';

/**
 * One listener for the whole page: feeds the pointer position into whichever
 * `.card-hover` element is under it, so globals.css can paint a gold spotlight
 * that follows the cursor. Mouse and pen only — touch has no hover to follow.
 */
export default function PointerSpotlight() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const card = (e.target as Element | null)?.closest?.<HTMLElement>('.card-hover');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return null;
}
