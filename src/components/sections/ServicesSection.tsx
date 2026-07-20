// src/components/sections/ServicesSection.tsx
'use client';

import { motion } from 'framer-motion';
import { services } from '@/src/data/portfolioData';
import GeometricShape from '@/src/components/ui/GeometricShape';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden py-24 md:py-32 lg:py-40 bg-[#0A0A0A]">
      {/* Rounded inner container accent */}
      <div className="absolute inset-x-0 top-0 h-24 bg-[#060606] rounded-b-[3rem]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[#060606] rounded-t-[3rem]" />

      <GeometricShape variant="diamond" position="bottom-left" size={350} opacity={0.1} />
      <GeometricShape variant="large-circle" position="top-right" size={400} opacity={0.08} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">What I Build</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-[#F5F0E8] mt-3">
            Solutions That Drive Business Growth
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="bg-[#0E0E0E] rounded-2xl p-8 card-hover group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/[0.02] rounded-full blur-2xl group-hover:bg-[#D4AF37]/[0.06] transition-all duration-700 -translate-y-1/2 translate-x-1/2" />
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center transition-all duration-500 group-hover:bg-[#D4AF37]/15 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                  <Icon size={20} strokeWidth={1.5} className="text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-semibold text-[#F5F0E8] mt-4">
                  {service.title}
                </h3>
                <p className="text-sm text-[#A09882] mt-2 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
