"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { expertiseCategories } from "@/src/data/portfolioData";
import GeometricShape from "@/src/components/ui/GeometricShape";

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// ---------------------------------------------------------------------------
// ExpertiseSection Component
// ---------------------------------------------------------------------------
const ExpertiseSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  /** Toggle expand -- only one card open at a time */
  const handleToggle = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="expertise" className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <GeometricShape variant="diamond" position="top-right" size={320} opacity={0.1} />
      <GeometricShape variant="corner-accent" position="bottom-left" size={350} opacity={0.08} />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-label">Expertise</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-[#F5F0E8] mt-4">
            Technical Capabilities
          </h2>
          <p className="text-[#A09882] mt-4 max-w-2xl">
            Capabilities that bridge engineering excellence with business outcomes.
          </p>
        </motion.div>

        {/* Expertise Columns — masonry-style so each column flows independently */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {expertiseCategories.map((category, index) => {
            const Icon = category.icon;
            const isExpanded = expandedIndex === index;

            return (
              <motion.div
                key={category.title}
                variants={cardVariants}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={`${category.title} — show technologies`}
                onClick={() => handleToggle(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggle(index);
                  }
                }}
                className={`break-inside-avoid bg-[#0E0E0E] rounded-2xl p-6 cursor-pointer card-hover transition-all duration-500 ${isExpanded ? 'border border-[#D4AF37]/15 shadow-[0_0_30px_rgba(212,175,55,0.03)]' : ''}`}
              >
                {/* Top Row: Icon + Title + Chevron */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className={`text-[#D4AF37] flex-shrink-0 transition-all duration-500 ${isExpanded ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]' : ''}`}
                    />
                    <h3 className="text-base font-semibold text-[#F5F0E8]">
                      {category.title}
                    </h3>
                  </div>

                  {/* Expand / Collapse Chevron */}
                  <ChevronDown
                    size={18}
                    strokeWidth={1.5}
                    className={`text-[#6B6355] transition-transform duration-300 flex-shrink-0 mt-0.5 ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>

                {/* Description */}
                <p className="text-sm text-[#A09882] mt-2">
                  {category.description}
                </p>

                {/* Expandable Technologies List */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#1F1F1F]">
                        {category.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs text-[#A09882] bg-[#161616] px-3 py-1.5 rounded-full border border-[#1F1F1F]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertiseSection;