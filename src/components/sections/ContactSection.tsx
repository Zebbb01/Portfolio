"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { contactInfo } from '../../data/portfolioData';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';

const ambientGlowVariants = {
  animate1: { 
    scale: [1, 1.1, 1],
    x: [0, 50, 0],
    y: [0, 25, 0],
    opacity: [0.03, 0.06, 0.03] 
  },
  animate2: { 
    scale: [1.1, 1, 1.1],
    x: [0, -50, 0],
    y: [0, -25, 0],
    opacity: [0.03, 0.06, 0.03] 
  }
};

const socialHover = {
  hover: { 
    y: -5, 
    scale: 1.1,
    transition: { type: "spring" as const, stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95 }
};

const ContactSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Message sent successfully!');
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        toast.error(data.message || 'Failed to send message.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden bg-brand-black">
      <Toaster position="bottom-right" reverseOrder={false} />
      
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {!shouldReduceMotion && (
          <>
            <motion.div 
              variants={ambientGlowVariants}
              animate="animate1"
              transition={{ duration: 20, repeat: Infinity, ease: "linear" as const }}
              className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-cyan/20 rounded-full blur-[120px] will-change-[transform,opacity]"
            />
            <motion.div 
              variants={ambientGlowVariants}
              animate="animate2"
              transition={{ duration: 18, repeat: Infinity, ease: "linear" as const }}
              className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-teal/20 rounded-full blur-[120px] will-change-[transform,opacity]"
            />
          </>
        )}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading 
          number="04"
          subtitle="Get In Touch"
          title="Ready to accelerate your business?"
          align="center"
        />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-black text-brand-white mb-8 italic tracking-tighter uppercase">
              Drop me a line
            </h3>
            <p className="text-brand-muted text-lg mb-12 max-w-md leading-relaxed">
              Whether you have a specific project in mind or just want to explore possibilities, I'm here to help you scale your digital presence.
            </p>
            
            <div className="space-y-8">
              {[
                { icon: Mail, label: "Email", value: contactInfo.email },
                { icon: Phone, label: "Phone", value: contactInfo.phone },
                { icon: MapPin, label: "Location", value: contactInfo.location }
              ].map((item, i) => (
                <div key={item.label} className="flex items-center space-x-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-brand-white/5 border border-brand-white/10 flex items-center justify-center group-hover:bg-brand-cyan transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <item.icon className="w-6 h-6 text-brand-cyan group-hover:text-brand-black transition-colors" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted mb-1">{item.label}</div>
                    <div className="text-brand-white font-bold tracking-tight">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4 mt-12">
              {contactInfo.socials.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialHover}
                  whileHover={shouldReduceMotion ? {} : "hover"}
                  whileTap={shouldReduceMotion ? {} : "tap"}
                  className="w-12 h-12 bg-brand-white/5 border border-brand-white/10 text-brand-white rounded-xl flex items-center justify-center hover:bg-brand-white/10 hover:border-brand-cyan/50 transition-colors duration-300 shadow-xl will-change-transform"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan/30 to-brand-teal/30 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-brand-black/60 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 border border-brand-white/10 shadow-2xl">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6" 
                    onSubmit={handleSubmit}
                  >
                    <div className="space-y-4">
                      <div className="relative group">
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-6 py-4 bg-brand-white/5 text-brand-white placeholder-brand-muted/50 border border-brand-white/10 rounded-2xl focus:outline-none focus:border-brand-cyan focus:bg-brand-white/10 focus:ring-4 focus:ring-brand-cyan/10 transition-all"
                        />
                      </div>
                      <div className="relative group">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-6 py-4 bg-brand-white/5 text-brand-white placeholder-brand-muted/50 border border-brand-white/10 rounded-2xl focus:outline-none focus:border-brand-cyan focus:bg-brand-white/10 focus:ring-4 focus:ring-brand-cyan/10 transition-all"
                        />
                      </div>
                      <div className="relative group">
                        <textarea
                          name="message"
                          placeholder="Project Details"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="w-full px-6 py-4 bg-brand-white/5 text-brand-white placeholder-brand-muted/50 border border-brand-white/10 rounded-2xl focus:outline-none focus:border-brand-cyan focus:bg-brand-white/10 focus:ring-4 focus:ring-brand-cyan/10 transition-all resize-none"
                        ></textarea>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group relative overflow-hidden bg-brand-cyan text-brand-black py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)]"
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                            <span>PROCESSING...</span>
                          </>
                        ) : (
                          <>
                            <span>SEND MESSAGE</span>
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 bg-brand-cyan/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                      <CheckCircle2 className="w-10 h-10 text-brand-cyan" />
                    </div>
                    <h4 className="text-3xl font-black text-brand-white mb-4 uppercase tracking-tight">Transmission Received</h4>
                    <p className="text-brand-muted leading-relaxed mb-8">
                      Thank you for reaching out. I'll review your message and get back to you within 24 hours.
                    </p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="text-brand-cyan font-bold uppercase tracking-widest text-xs border-b border-brand-cyan pb-1 hover:text-brand-white hover:border-brand-white transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;