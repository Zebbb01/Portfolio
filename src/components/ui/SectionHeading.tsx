"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  number?: string;
  align?: "left" | "center";
}

export const SectionHeading = ({
  title,
  subtitle,
  number,
  align = "left",
}: SectionHeadingProps) => {
  return (
    <div className={`mb-16 md:mb-24 ${align === "center" ? "text-center md:text-left" : "text-left"}`}>
      {number && (
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 0.1, x: 0 }}
          viewport={{ once: true }}
          className="block text-7xl md:text-9xl font-black text-brand-white mb-[-0.5em] select-none"
        >
          {number}
        </motion.span>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
      >
        {subtitle && (
          <span className="text-brand-cyan text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4 block">
            {subtitle}
          </span>
        )}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-white tracking-tight">
          {title}
        </h2>
        <div className={`h-1 w-20 bg-brand-cyan mt-6 ${align === "center" ? "mx-auto md:mx-0" : ""}`} />
      </motion.div>
    </div>
  );
};
