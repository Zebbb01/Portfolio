// src/app/projects/[slug]/page.tsx
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { projects, projectScreenshots } from '../../../data/portfolioData';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Globe,
  Shield,
  Zap,
  Layout,
  CheckCircle2,
  Layers,
  Cpu,
  Monitor,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageGallery } from '../../../components/ui/ImageGallery';
import GeometricShape from '../../../components/ui/GeometricShape';

const ProjectCaseStudy = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const project = projects.find(p => p.detailsUrl === `/projects/${slug}`);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.05]);

  if (!project) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#060606]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl font-heading font-bold text-[#D4AF37] mb-8">404</h1>
          <p className="text-xl text-[#A09882] mb-12">Project not found.</p>
          <Link
            href="/#projects"
            className="btn-primary"
          >
            Return to Portfolio
          </Link>
        </motion.div>
      </div>
    );
  }

  // Get project-specific features based on slug
  const getProjectFeatures = () => {
    switch (slug) {
      case 'profitview':
        return [
          { title: 'SaaS Architecture', desc: 'Multi-tenant system with strict data isolation and enterprise security.', icon: Shield },
          { title: 'AI Automation', desc: 'Intelligent expense capture and financial alerts powered by AI agents.', icon: Cpu },
          { title: 'Real-Time Operations', desc: 'Live invoicing, banking recon, and instant financial reporting.', icon: Zap },
          { title: 'Modern Stack', desc: 'Engineered with Next.js 15, Supabase, and Stripe for maximum scale.', icon: Layout },
        ];
      case 'rundzee':
        return [
          { title: '5-App Ecosystem', desc: 'Customer v2 (Expo Router), merchant, rider mobile apps, admin portal, and web platform.', icon: Layers },
          { title: 'Real-Time GPS & Maps', desc: 'Live tracking with custom Map IDs, Google Maps routing, and Supabase Realtime synchronization.', icon: Globe },
          { title: 'Context Support Chat', desc: 'Custom in-app customer support chat system using React Context API for instant messaging.', icon: Zap },
          { title: 'Auth & DB Security', desc: 'Secure OTP verification, Google/Facebook OAuth fallbacks, complex DB triggers, and audit logs.', icon: Shield },
        ];
      case 'body-tracker':
        return [
          { title: 'AI Nutrition', desc: 'Analyze meals from photos using AI-powered food recognition.', icon: Cpu },
          { title: 'Offline-First PWA', desc: 'Progressive Web App with IndexedDB for full offline capability.', icon: Shield },
          { title: 'TDEE Calculator', desc: 'Precise calorie and macro tracking with body composition analysis.', icon: Layout },
          { title: 'Fasting Widget', desc: 'Intermittent fasting tracker with customizable fasting windows.', icon: Zap },
        ];
      case 'ghl-website':
        return [
          { title: 'Conversion Funnels', desc: 'High-converting sales funnels with A/B tested layouts and CTAs.', icon: TrendingUp },
          { title: 'CRM Integration', desc: 'Automated lead nurturing sequences with GoHighLevel CRM.', icon: Layout },
          { title: 'Micro-Animations', desc: 'Immersive CSS animations that drive engagement and retention.', icon: Zap },
          { title: 'Lead Capture', desc: 'Multi-step forms with smart qualification and instant follow-up.', icon: Shield },
        ];
      case 'n8n-automation':
        return [
          { title: 'Multi-Step Pipelines', desc: 'Complex automation workflows connecting 10+ services in sequence.', icon: Layers },
          { title: 'Webhook Triggers', desc: 'Event-driven automation responding to real-time business events.', icon: Zap },
          { title: 'AI Document Processing', desc: 'OCR and AI-powered extraction from invoices, receipts, and forms.', icon: Cpu },
          { title: 'CRM Sync', desc: 'Bi-directional data sync between CRMs, databases, and messaging tools.', icon: Layout },
        ];
      default:
        return [
          { title: 'Scalable Architecture', desc: 'Built for growth with modular, maintainable code.', icon: Layers },
          { title: 'Security First', desc: 'Enterprise-grade security with RLS and validation.', icon: Shield },
          { title: 'Performance', desc: 'Optimized for speed and reliability at scale.', icon: Zap },
          { title: 'Modern UX', desc: 'Clean, intuitive interfaces that drive engagement.', icon: Layout },
        ];
    }
  };

  const features = getProjectFeatures();

  return (
    <div className="bg-[#060606] min-h-screen text-[#F5F0E8] selection:bg-[#D4AF37]/30 selection:text-[#F5F0E8]">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/#projects')}
        className="fixed top-6 left-6 z-[100] flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#060606]/60 backdrop-blur-xl border border-[#1F1F1F] text-[#A09882] hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-wide">Back to Portfolio</span>
      </motion.button>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          {project.mediaType === 'video' ? (
            <video
              src={project.mediaSrc}
              className="w-full h-full object-cover opacity-30 brightness-50"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={project.mediaSrc}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover opacity-30 brightness-50"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/30 via-[#060606]/60 to-[#060606]" />
        </motion.div>

        {/* Geometric accent */}
        <GeometricShape variant="quarter-circle" position="top-right" size={400} opacity={0.05} />
        <GeometricShape variant="concentric-arcs" position="bottom-left" size={300} opacity={0.04} />

        {/* Subtle gold ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] text-xs font-medium tracking-[0.15em] uppercase mb-8"
            >
              {project.category}
            </motion.span>

            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-[#F5F0E8] tracking-tight leading-[0.95] mb-6">
              {project.title}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[#A09882] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {project.description.split('.').slice(0, 2).join('.') + '.'}
            </motion.p>

            {/* Impact pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-10"
            >
              <span className="inline-flex items-center gap-2 border border-[#D4AF37]/25 rounded-full px-5 py-2 text-sm text-[#D4AF37]">
                <TrendingUp size={16} strokeWidth={1.5} />
                {project.impact}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {project.live && project.live !== "#" && project.live !== "" ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <Globe size={16} strokeWidth={1.5} />
                  Launch Live Demo
                </a>
              ) : (
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="btn-primary"
                >
                  <Monitor size={16} strokeWidth={1.5} />
                  Explore Gallery
                </button>
              )}
              {project.github && project.github !== "#" && project.github !== "" && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <Github size={16} strokeWidth={1.5} />
                  Repository
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-24 md:py-32 bg-[#0A0A0A]">
        <div className="absolute inset-x-0 top-0 h-24 bg-[#060606] rounded-b-[3rem]" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left Column: Challenge + Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-16"
            >
              {/* The Challenge */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                    <Shield size={18} strokeWidth={1.5} className="text-[#D4AF37]" />
                  </div>
                  <h3 className="section-label">The Challenge</h3>
                </div>
                <p className="text-[#A09882] text-lg leading-relaxed">
                  {project.problem}
                </p>
              </div>

              {/* Solution */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                    <Zap size={18} strokeWidth={1.5} className="text-[#D4AF37]" />
                  </div>
                  <h3 className="section-label">The Solution</h3>
                </div>
                <p className="text-[#A09882] text-lg leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                    <Layers size={18} strokeWidth={1.5} className="text-[#D4AF37]" />
                  </div>
                  <h3 className="section-label">Key Features</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-2xl bg-[#0E0E0E] border border-[#1F1F1F] hover:border-[#D4AF37]/15 transition-all"
                    >
                      <feature.icon size={20} strokeWidth={1.5} className="text-[#D4AF37] mb-4" />
                      <h4 className="text-sm font-semibold text-[#F5F0E8] uppercase tracking-wide mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-[#A09882] leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcome */}
              <div className="p-8 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/15">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 size={20} strokeWidth={1.5} className="text-[#D4AF37]" />
                  <h3 className="section-label">Business Outcome</h3>
                </div>
                <p className="text-[#F5F0E8] text-xl font-heading font-semibold">
                  {project.impact}
                </p>
                <p className="text-[#A09882] text-sm mt-2 leading-relaxed">
                  Delivered a production-ready system that meets enterprise requirements for security, scalability, and performance.
                </p>
              </div>
            </motion.div>

            {/* Right Column: Sticky Meta Card */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Project Meta Card */}
                <div className="p-8 rounded-2xl bg-[#0E0E0E] border border-[#1F1F1F]">
                  <h3 className="section-label mb-8">Project Meta</h3>

                  {/* Tech Stack */}
                  <div className="mb-8">
                    <p className="text-xs text-[#6B6355] uppercase tracking-widest font-medium mb-3">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map(t => (
                        <span
                          key={t}
                          className="px-3 py-1.5 bg-[#161616] rounded-full text-xs text-[#A09882] border border-[#1F1F1F]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="p-4 rounded-xl bg-[#161616] border border-[#1F1F1F]">
                      <CheckCircle2 size={18} strokeWidth={1.5} className="text-[#D4AF37] mb-3" />
                      <p className="text-[10px] text-[#6B6355] uppercase tracking-widest mb-0.5">Status</p>
                      <p className="text-xs font-medium text-[#F5F0E8]">Production</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#161616] border border-[#1F1F1F]">
                      <Zap size={18} strokeWidth={1.5} className="text-[#D4AF37] mb-3" />
                      <p className="text-[10px] text-[#6B6355] uppercase tracking-widest mb-0.5">Scale</p>
                      <p className="text-xs font-medium text-[#F5F0E8]">Enterprise</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {project.live && project.live !== "#" && project.live !== "" ? (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-[#D4AF37] text-[#060606] font-semibold text-xs tracking-wide transition-all hover:bg-[#E8D48B] group"
                      >
                        <span className="flex items-center gap-2"><Globe size={15} strokeWidth={1.5} /> Live Preview</span>
                        <ExternalLink size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    ) : (
                      <button
                        onClick={() => setIsGalleryOpen(true)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-[#D4AF37] text-[#060606] font-semibold text-xs tracking-wide transition-all hover:bg-[#E8D48B] group"
                      >
                        <span className="flex items-center gap-2"><Monitor size={15} strokeWidth={1.5} /> Explore Gallery</span>
                        <ExternalLink size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                    {project.github && project.github !== "#" && project.github !== "" && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-[#161616] border border-[#1F1F1F] text-[#F5F0E8] font-medium text-xs tracking-wide transition-all hover:border-[#D4AF37]/20 group"
                      >
                        <span className="flex items-center gap-2"><Github size={15} strokeWidth={1.5} /> Source Code</span>
                        <ExternalLink size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Philosophy Card */}
                <div className="p-6 rounded-2xl bg-[#0E0E0E] border border-[#1F1F1F] hidden lg:block">
                  <GeometricShape variant="quarter-circle" position="bottom-right" size={120} opacity={0.06} />
                  <h4 className="text-xs text-[#D4AF37] font-medium tracking-[0.15em] uppercase mb-3">Engineering First</h4>
                  <p className="text-xs text-[#6B6355] leading-relaxed relative z-10">
                    Every project is built with production-grade architecture, strict security, and scalability as core principles.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Screenshot */}
      <section className="py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6"
        >
          <div
            className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-[#1F1F1F] cursor-pointer group"
            onClick={() => setIsGalleryOpen(true)}
          >
            {project.mediaType === 'video' ? (
              <video
                src={project.mediaSrc}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={project.mediaSrc}
                alt={`${project.title} overview`}
                fill
                sizes="90vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <p className="section-label mb-1">System Overview</p>
              <p className="text-xs text-[#6B6355]">Click to explore full gallery</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Back to Portfolio CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[#6B6355] text-sm mb-6">Explore more projects</p>
          <Link href="/#projects" className="btn-secondary">
            <ArrowLeft size={16} strokeWidth={1.5} />
            Back to All Projects
          </Link>
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
};

export default ProjectCaseStudy;
