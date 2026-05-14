"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Cpu, Database, Brain, Zap, CheckCircle2, TrendingUp, Clock, MousePointer2 } from 'lucide-react';
import { techStack, aboutData } from '../../data/portfolioData';
import { SectionHeading } from '../ui/SectionHeading';

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
      ease: [0.16, 1, 0.3, 1] as any
    } 
  },
};

const statIcons = [Clock, MousePointer2, TrendingUp];

const ExpertiseSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="expertise" className="py-12 md:py-16 relative overflow-hidden bg-brand-black">
      {/* Background Subtle Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading 
          number="02"
          subtitle="Expertise"
          title="Technical Core & Business Impact"
          align="center"
        />

        {/* Impact Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {aboutData.stats.map((stat, idx) => {
            const Icon = statIcons[idx];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-center space-x-4 group hover:border-brand-cyan/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-white leading-none mb-1">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-brand-muted font-bold leading-tight">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Technical Core Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {/* Frontend Card */}
          <motion.div 
            variants={shouldReduceMotion ? {} : cardVariants}
            className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-brand-cyan/50 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <Cpu className="w-10 h-10 text-brand-cyan mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-brand-white mb-4">Frontend Architecture</h3>
              <ul className="space-y-3">
                {techStack.frontend.map((tech) => (
                  <li key={tech.name} className="flex items-center text-brand-muted text-sm group/item">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan/40 mr-3 group-hover/item:text-brand-cyan transition-colors" />
                    <span className="group-hover/item:text-brand-white transition-colors">{tech.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Infrastructure Card */}
          <motion.div 
            variants={shouldReduceMotion ? {} : cardVariants}
            className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-brand-cyan/50 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <Database className="w-10 h-10 text-brand-cyan mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-brand-white mb-4">Backend & Infrastructure</h3>
              <ul className="space-y-3">
                {techStack.infrastructure.map((tech) => (
                  <li key={tech.name} className="flex items-center text-brand-muted text-sm group/item">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan/40 mr-3 group-hover/item:text-brand-cyan transition-colors" />
                    <span className="group-hover/item:text-brand-white transition-colors">{tech.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* AI Card */}
          <motion.div 
            variants={shouldReduceMotion ? {} : cardVariants}
            className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-brand-cyan/50 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <Brain className="w-10 h-10 text-brand-cyan mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-brand-white mb-4">AI & Automation</h3>
              <ul className="space-y-3">
                {techStack.automation.map((tech) => (
                  <li key={tech.name} className="flex items-center text-brand-muted text-sm group/item">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan/40 mr-3 group-hover/item:text-brand-cyan transition-colors" />
                    <span className="group-hover/item:text-brand-white transition-colors">{tech.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertiseSection;