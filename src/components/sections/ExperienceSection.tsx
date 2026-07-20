"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { experiences } from "@/src/data/portfolioData";
import GeometricShape from "@/src/components/ui/GeometricShape";

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const entryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
};

// ---------------------------------------------------------------------------
// ExperienceSection Component
// ---------------------------------------------------------------------------
const ExperienceSection = () => {
  return (
    <section id="experience" className="relative overflow-hidden py-24 md:py-32 lg:py-40 bg-[#0A0A0A]">
      {/* Rounded corner accents */}
      <div className="absolute inset-x-0 top-0 h-24 bg-[#060606] rounded-b-[3rem]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[#060606] rounded-t-[3rem]" />
      <GeometricShape variant="concentric-arcs" position="top-right" size={350} opacity={0.1} />
      <GeometricShape variant="quarter-circle" position="bottom-left" size={300} opacity={0.08} />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <Briefcase size={20} strokeWidth={1.5} className="text-[#D4AF37]" />
            <span className="section-label">Experience</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-[#F5F0E8]">
            Professional Journey
          </h2>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative space-y-16"
        >
          {/* Vertical Gold Line */}
          <div className="absolute left-0 md:left-8 w-px bg-[#D4AF37]/15 top-0 bottom-0" />

          {experiences.map((exp, index) => (
            <motion.div
              key={`${exp.company}-${index}`}
              variants={entryVariants}
              className="relative pl-8 md:pl-20"
            >
              {/* Gold Dot Marker */}
              <div
                className="absolute left-0 md:left-8 top-1.5 w-3 h-3 rounded-full bg-[#D4AF37] border-2 border-[#060606] -translate-x-1/2"
              />

              {/* Type Badge */}
              <span
                className={`text-xs font-medium tracking-[0.15em] uppercase ${
                  exp.type === "Full-Time"
                    ? "text-[#D4AF37]"
                    : "text-[#A09882]"
                }`}
              >
                {exp.type}
              </span>

              {/* Title */}
              <h3 className="font-heading text-xl md:text-2xl font-semibold text-[#F5F0E8] mt-1">
                {exp.title}
              </h3>

              {/* Company */}
              <p className="text-sm text-[#A09882] mt-0.5">
                {exp.company}
              </p>

              {/* Period */}
              <p className="text-xs text-[#6B6355] mt-1">
                {exp.period}
              </p>

              {/* Description */}
              <p className="text-sm text-[#A09882] mt-4 leading-relaxed">
                {exp.description}
              </p>

              {/* Highlights */}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex items-start text-sm text-[#A09882]">
                      <span className="text-[#D4AF37] mr-2 flex-shrink-0">-</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Tech Tags */}
              {exp.tech && exp.tech.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs text-[#6B6355] bg-[#0E0E0E] px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;
