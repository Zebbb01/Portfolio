// src/components/sections/ContactSection.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Send, MapPin, Clock, Mail, Phone, CheckCircle, RotateCcw } from 'lucide-react';
import { contactInfo } from '@/src/data/portfolioData';
import GeometricShape from '@/src/components/ui/GeometricShape';

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  // Bots fill every field they find; people never see this one.
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Silently accept and drop anything that filled the honeypot.
    if (honeypot) {
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'GENERIC');
      }

      setIsSuccess(true);
      setFormState({ name: '', email: '', message: '' });
      toast.success('Message sent. I will be in touch soon.');
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'GENERIC';
      const message =
        raw === 'GENERIC'
          ? 'Something went wrong. Please try again, or email me directly.'
          : raw;
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setError('');
  };

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <GeometricShape variant="diamond" position="top-left" size={300} opacity={0.1} />
      <GeometricShape variant="large-circle" position="bottom-right" size={450} opacity={0.1} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="lg:grid lg:grid-cols-2 gap-16">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <p className="section-label">Get In Touch</p>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#4ADE80]/25 bg-[#4ADE80]/[0.07] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#4ADE80]">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
                </span>
                Open to collaboration
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-[#F5F0E8] mt-3">
              Let&apos;s Build Something Together
            </h2>
            <p className="text-[#A09882] mt-4 leading-relaxed">
              I am open to contract work, technical partnerships, and collaborating on a build.
              Whether it is a new platform, a system overhaul, or a second pair of hands on
              something already running &mdash; tell me the problem and I will tell you honestly
              whether I am the right person for it.
            </p>

            <ul className="flex flex-wrap gap-2 mt-5">
              {['Contract work', 'Technical partnership', 'Collaboration', 'Consulting'].map((item) => (
                <li
                  key={item}
                  className="text-xs text-[#A09882] bg-[#0E0E0E] border border-[#1F1F1F] rounded-full px-3 py-1.5"
                >
                  {item}
                </li>
              ))}
            </ul>

            {/* Contact details */}
            <div className="mt-8 space-y-4">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 text-[#F5F0E8] hover:text-[#D4AF37] transition-colors"
              >
                <Mail size={16} strokeWidth={1.5} className="text-[#D4AF37]" />
                {contactInfo.email}
              </a>
              <div className="flex items-center gap-3 text-[#A09882]">
                <Phone size={16} strokeWidth={1.5} className="text-[#D4AF37]" />
                {contactInfo.phone}
              </div>
              <div className="flex items-center gap-3 text-[#A09882]">
                <MapPin size={16} strokeWidth={1.5} className="text-[#D4AF37]" />
                {contactInfo.location}
              </div>
            </div>

            {/* Response time */}
            <div className="flex items-center gap-2 mt-4 text-xs text-[#6B6355]">
              <Clock size={14} strokeWidth={1.5} />
              {contactInfo.responseTime}
            </div>

            {/* Social icons */}
            <div className="flex gap-4 mt-8">
              {contactInfo.socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6B6355] hover:text-[#D4AF37] transition-colors"
                    aria-label={social.name}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-12 lg:mt-0 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-[#D4AF37]/[0.03] via-transparent to-[#D4AF37]/[0.02] rounded-3xl blur-xl pointer-events-none" />
            {isSuccess ? (
              <div
                role="status"
                className="flex flex-col items-center justify-center h-full min-h-[300px] text-center"
              >
                <CheckCircle size={48} strokeWidth={1.5} className="text-[#D4AF37] mb-4" />
                <p className="text-xl font-heading font-semibold text-[#F5F0E8]">
                  Message sent.
                </p>
                <p className="text-sm text-[#A09882] mt-2">
                  {contactInfo.responseTime}.
                </p>
                <button type="button" onClick={resetForm} className="btn-secondary mt-8">
                  <RotateCcw size={15} strokeWidth={1.5} />
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate={false} className="relative space-y-5">
                {/* Honeypot: off-screen for people, irresistible to bots */}
                <input
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <div>
                  <label htmlFor="contact-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    required
                    maxLength={100}
                    autoComplete="name"
                    className="input-luxe"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    placeholder="Your email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    required
                    maxLength={200}
                    autoComplete="email"
                    className="input-luxe"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">
                    Your message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell me about your project..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    required
                    maxLength={4000}
                    rows={6}
                    className="input-luxe resize-none"
                  />
                  <p className="text-[11px] text-[#6B6355] mt-2 text-right">
                    {formState.message.length} / 4000
                  </p>
                </div>

                {error && (
                  <p role="alert" className="text-sm text-[#F87171]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send size={16} strokeWidth={1.5} />
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}