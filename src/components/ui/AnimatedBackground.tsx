'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  count?: number;
  className?: string;
  colors?: string[];
}

export default function AnimatedBackground({
  count = 5,
  className = '',
  colors = ['#D4AF37', '#8A7322', '#F5F0E8', '#40300A', '#F0E6D2'],
}: AnimatedBackgroundProps) {
  // Deterministic positions based on index
  const orbs = Array.from({ length: count }).map((_, i) => ({
    id: i,
    size: 100 + (i * 37) % 200, // 100-300px
    x: (i * 23) % 100, // 0-100vw
    y: (i * 47) % 100, // 0-100vh
    duration: 15 + (i * 7) % 15, // 15-30s
    color: colors[i % colors.length],
    delay: (i * 3) % 10,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            backgroundColor: orb.color,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            opacity: 0.05,
          }}
          animate={{
            x: [0, (orb.id % 2 === 0 ? 100 : -100), 0],
            y: [0, (orb.id % 3 === 0 ? 100 : -100), 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
