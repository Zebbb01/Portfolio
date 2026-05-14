"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { projects, projectScreenshots } from '../../../data/portfolioData';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, 
  Globe, 
  Layout, 
  CheckCircle2, 
  Box,
  Layers,
  Cpu,
  Monitor,
  Zap,
  Workflow,
  Shield
} from 'lucide-react';
import Image from 'next/image';
import { ImageGallery } from '../../../components/ui/ImageGallery';

export default function GrowthSystemsCaseStudy() {
  const router = useRouter();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const project = projects.find(p => p.detailsUrl === '/projects/growth-systems');
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.1]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.4], [0, 10]);

  if (!project) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  return (
    <div className="relative bg-brand-black min-h-screen text-brand-white selection:bg-brand-cyan selection:text-brand-black">
      {/* Cinematic Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/#projects')}
        className="fixed top-8 left-8 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl bg-brand-black/40 backdrop-blur-xl border border-brand-white/10 text-brand-white hover:border-brand-cyan hover:text-brand-cyan transition-all group shadow-2xl hover:shadow-brand-cyan/20"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">Back to Portfolio</span>
      </motion.button>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, filter: `blur(${heroBlur}px)` }}
          className="absolute inset-0 z-0"
        >
          {project.mediaType === 'video' ? (
            <video
              src={project.mediaSrc}
              className="w-full h-full object-cover opacity-40 brightness-50"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          ) : (
            <Image 
              src={project.mediaSrc}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover opacity-40 grayscale-[0.3] brightness-50"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/20 via-brand-black/60 to-brand-black" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Workflow className="w-3 h-3" /> Systems Engineering
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-brand-white tracking-tighter mb-8 italic uppercase leading-[0.9]">
              Growth <span className="text-brand-cyan">Automation</span> Systems
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setIsGalleryOpen(true)}
                className="px-8 py-4 rounded-full bg-brand-cyan text-brand-black font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3 shadow-[0_0_30px_rgba(0,229,255,0.4)]"
              >
                <Monitor className="w-5 h-5" /> Explore Gallery
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:col-span-7 space-y-24">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl md:text-5xl font-black text-brand-white uppercase italic mb-10 flex items-center gap-4">
                  <Monitor className="w-7 h-7 text-brand-cyan" /> The Problem
                </h2>
                <p className="text-brand-muted text-xl md:text-2xl leading-relaxed font-medium">
                  {project.description}
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-2xl font-black text-brand-white uppercase tracking-widest mb-12 flex items-center gap-4">
                  <Layers className="w-6 h-6 text-brand-cyan" /> Intelligence & Flow
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "n8n Pipelines", desc: "Complex, multi-step workflows that handle thousands of events daily.", icon: Workflow },
                    { title: "Data Bridge", desc: "Connecting disconnected silos into a unified, synchronized ecosystem.", icon: Box },
                    { title: "Real-time Response", desc: "Automated triggers that react to customer actions in milliseconds.", icon: Zap },
                    { title: "Resilient Ops", desc: "Enterprise-grade error handling and self-healing data pipelines.", icon: Shield }
                  ].map((feature, i) => (
                    <div key={i} className="p-8 rounded-3xl bg-brand-white/5 border border-brand-white/10">
                      <feature.icon className="w-10 h-10 text-brand-cyan mb-6" />
                      <h4 className="text-lg font-black text-brand-white uppercase mb-3">{feature.title}</h4>
                      <p className="text-brand-muted text-sm">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-10 rounded-[2.5rem] bg-gradient-to-br from-brand-white/10 to-transparent border border-brand-white/10 backdrop-blur-2xl">
                <h3 className="text-2xl font-black text-brand-white uppercase italic tracking-widest mb-12 border-b border-brand-white/10 pb-6">Project Meta</h3>
                <div className="space-y-12">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-cyan mb-6">Automation Stack</div>
                    <div className="flex flex-wrap gap-3">
                      {project.tech.map(t => (
                        <span key={t} className="px-4 py-2 bg-brand-black/60 rounded-xl text-xs text-brand-white font-bold border border-brand-white/10">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-brand-black/40 border border-brand-white/5">
                      <CheckCircle2 className="w-6 h-6 text-brand-cyan mb-4" />
                      <div className="text-[9px] font-black uppercase text-brand-muted mb-1">Efficiency</div>
                      <div className="text-xs font-bold text-brand-white">70% Response Lift</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-brand-black/40 border border-brand-white/5">
                      <Cpu className="w-6 h-6 text-brand-cyan mb-4" />
                      <div className="text-[9px] font-black uppercase text-brand-muted mb-1">Architecture</div>
                      <div className="text-xs font-bold text-brand-white">Serverless</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsGalleryOpen(true)}
                    className="w-full flex items-center justify-center p-5 rounded-2xl bg-brand-cyan text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(0,229,255,0.3)]"
                  >
                    <Monitor className="w-4 h-4 mr-2" /> Explore Gallery
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <ImageGallery 
        images={projectScreenshots[project.title] || []}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        title={project.title}
      />
    </div>
  );
}
