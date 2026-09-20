// src/components/sections/AboutSection.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { aboutData } from '@/src/data/portfolioData';
import GeometricShape from '@/src/components/ui/GeometricShape';

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden py-24 md:py-32 lg:py-40 bg-[#0A0A0A]">
      {/* Rounded corner accents */}
      <div className="absolute inset-x-0 top-0 h-24 bg-[#060606] rounded-b-[3rem]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[#060606] rounded-t-[3rem]" />
      <GeometricShape variant="corner-accent" position="bottom-right" size={450} opacity={0.1} />
      <GeometricShape variant="concentric-arcs" position="top-left" size={300} opacity={0.08} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#D4AF37]/20 via-transparent to-[#D4AF37]/10 rounded-2xl blur-sm" />
              <Image
                src="/images/gerald_v.webp"
                alt="Gerald Villaceran"
                width={500}
                height={600}
                sizes="(max-width: 1024px) 90vw, 500px"
                className="rounded-2xl object-cover w-full max-w-md mx-auto lg:mx-0"
              />
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 lg:mt-0"
          >
            <p className="section-label">About</p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-[#F5F0E8] mt-3">
              {aboutData.title}
            </h2>

            {aboutData.bio.map((paragraph, index) => (
              <p
                key={index}
                className={`text-base md:text-lg leading-relaxed mt-4 ${
                  index === 0 ? 'text-[#F5F0E8]' : 'text-[#A09882]'
                }`}
              >
                {paragraph}
              </p>
            ))}

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#1F1F1F]">
              {aboutData.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-[#D4AF37] font-heading">{stat.value}</p>
                  <p className="text-[10px] text-[#6B6355] uppercase tracking-[0.1em] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
