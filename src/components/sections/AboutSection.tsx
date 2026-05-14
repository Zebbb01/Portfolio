"use client";

import React from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { aboutData } from '../../data/portfolioData';
import { SectionHeading } from '../ui/SectionHeading';
import Image from 'next/image';

const AboutSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yValue = shouldReduceMotion ? 0 : y;

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden bg-brand-black">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Side: Content */}
          <div className="lg:w-1/2">
            <SectionHeading
              number="01"
              subtitle="The Philosophy"
              title={aboutData.title}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-2xl md:text-4xl font-bold text-brand-white mb-8 leading-tight">
                {aboutData.statement}
              </h3>

              <p className="text-brand-muted text-lg md:text-xl leading-relaxed mb-12 max-w-xl">
                {aboutData.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {aboutData.stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="p-6 rounded-2xl bg-brand-white/5 border border-brand-white/10 backdrop-blur-sm"
                  >
                    <div className="text-3xl font-black text-brand-cyan mb-1">{stat.value}</div>
                    <div className="text-xs font-bold text-brand-white uppercase tracking-widest mb-2">{stat.label}</div>
                    <div className="text-[10px] text-brand-muted leading-tight">{stat.detail}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side: Interactive Visual */}
          <div className="lg:w-1/2 w-full aspect-square relative lg:sticky lg:top-32">
            <motion.div
              style={{ y: yValue, willChange: "transform" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-full h-full max-w-md max-h-md mx-auto">
                {/* Abstract Interactive Element */}
                <div
                  className="w-full h-full rounded-[3rem] border-2 border-brand-cyan/20 flex items-center justify-center p-8 overflow-hidden group"
                  data-placeholder="About section abstract visual - 3D geometric shape or portrait"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/10 to-brand-teal/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 w-full aspect-[4/5] rounded-2xl bg-brand-black/50 border border-brand-white/10 shadow-2xl flex items-end justify-center overflow-hidden group/image">
                    <Image
                      src="https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-images/gerald_v.png"
                      alt="Gerald Villaceran"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain object-bottom transition-all duration-700 hover:scale-105"
                    />
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" as const }}
                    className="absolute -top-10 -right-10 w-32 h-32 border border-brand-cyan/30 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" as const }}
                    className="absolute -bottom-20 -left-10 w-48 h-48 border border-brand-teal/20 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />
    </section>
  );
};

export default AboutSection;
