// src/components/sections/ContactSection.tsx
'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Clock, Mail, Phone, CheckCircle } from 'lucide-react';
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      if (!res.ok) throw new Error('Failed to send message');

      setIsSuccess(true);
      setFormState({ name: '', email: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again or email directly.');
    } finally {
      setIsSubmitting(false);
    }
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
            <p className="section-label">Get In Touch</p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-[#F5F0E8] mt-3">
              Let&apos;s Build Something Together
            </h2>
            <p className="text-[#A09882] mt-4 leading-relaxed">
              Have a project in mind? I&apos;d love to hear about it. Whether it&apos;s a new platform,
              a system overhaul, or a conversation about what&apos;s possible.
            </p>

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
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                <CheckCircle size={48} strokeWidth={1.5} className="text-[#D4AF37] mb-4" />
                <p className="text-xl font-heading font-semibold text-[#F5F0E8]">
                  Message sent.
                </p>
                <p className="text-sm text-[#A09882] mt-2">
                  I&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    required
                    className="input-luxe"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    required
                    className="input-luxe"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Tell me about your project..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    required
                    rows={6}
                    className="input-luxe resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-[#F87171]">{error}</p>
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