"use client";

import { motion } from "framer-motion";

interface FloatingShapeProps {
  color: string;
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: number;
  duration?: number;
}

export const FloatingShape = ({
  color,
  size,
  top,
  left,
  right,
  bottom,
  delay = 0,
  duration = 20,
}: FloatingShapeProps) => {
  return (
    <motion.div
      animate={{
        x: [0, 40, -40, 0],
        y: [0, -40, 40, 0],
        scale: [1, 1.1, 0.9, 1],
        rotate: [0, 90, 180, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear" as const,
        delay,
      }}
      className={`absolute rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none z-0`}
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
      }}
    />
  );
};
