// src/components/ui/CollaborationCTA.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { contactInfo } from '@/src/data/portfolioData';

const iconFor = (name: string) => {
  if (name === 'GitHub') return Github;
  if (name === 'LinkedIn') return Linkedin;
  return Mail;
};

interface CollaborationCTAProps {
  /** What the visitor just finished reading, so the invitation is specific. */
  subject?: string;
}

export default function CollaborationCTA({ subject }: CollaborationCTAProps) {
  return (
    <section className="relative py-20 md:py-28" aria-labelledby="collaborate-heading">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/15 bg-gradient-to-br from-[#D4AF37]/[0.07] via-[#0E0E0E] to-[#0E0E0E] p-8 sm:p-12 text-center"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] max-w-[120%] bg-[#D4AF37]/[0.06] rounded-full blur-[110px] pointer-events-none" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#4ADE80]/25 bg-[#4ADE80]/[0.07] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#4ADE80]">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
              </span>
              Open to collaboration
            </span>

            <h2
              id="collaborate-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-[#F5F0E8] mt-6 leading-[1.15] tracking-[-0.02em]"
            >
              Want to build something like this together?
            </h2>

            <p className="text-sm sm:text-base text-[#A09882] mt-4 max-w-xl mx-auto leading-relaxed">
              {subject
                ? `If ${subject} is close to what you need, I am open to contract work, technical partnerships and collaborating on a build. Tell me the problem and I will tell you honestly whether I am the right person for it.`
                : 'I am open to contract work, technical partnerships and collaborating on a build. Tell me the problem and I will tell you honestly whether I am the right person for it.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <a href="/#contact" className="btn-primary group w-full sm:w-auto">
                Start a conversation
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a href={`mailto:${contactInfo.email}`} className="btn-secondary w-full sm:w-auto">
                <Mail size={15} strokeWidth={1.5} />
                Email me directly
              </a>
            </div>

            <div className="flex items-center justify-center gap-5 mt-8 pt-8 border-t border-[#1F1F1F]">
              {contactInfo.socials.map((social) => {
                const Icon = iconFor(social.name);
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="text-[#6B6355] hover:text-[#D4AF37] transition-colors"
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </a>
                );
              })}
              <span className="text-xs text-[#6B6355] ml-1">{contactInfo.responseTime}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
