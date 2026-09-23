// src/components/ui/CountUp.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/**
 * Counts the numeric part of a display value up from zero the first time it
 * scrolls into view — '158K', '460+', 'v0.66' keep their prefix and suffix.
 * Renders the final value on the server and under reduced motion.
 */
export default function CountUp({ value, duration = 1.4 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!inView || reduce || !m) return;
    const [, prefix, num, suffix] = m;
    const decimals = num.split('.')[1]?.length ?? 0;
    const controls = animate(0, Number(num), {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => setDisplay(`${prefix}${n.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
