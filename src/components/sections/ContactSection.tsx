"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { contactInfo } from '../../data/portfolioData';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setFormData({ name: '', email: '', message: '' }); // Clear form
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
    <section id="contact" className="py-20 bg-transparent relative z-10/20">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 text-brand-white"
        >
          Get In Touch
        </motion.h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-brand-cyan mb-6">
              Let&apos;s Connect
            </h3>
            <p className="text-brand-muted mb-6">
              I&apos;m always open to discussing new opportunities, collaborations, or just having a chat about web development. Feel free to reach out!
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand-cyan" />
                <span className="text-brand-muted">{contactInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-cyan" />
                <span className="text-brand-muted">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-brand-cyan" />
                <span className="text-brand-muted">{contactInfo.location}</span>
              </div>
            </div>
            <div className="flex space-x-4 pt-6">
              {contactInfo.socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="bg-brand-teal/20 text-brand-cyan p-3 rounded-full hover:bg-brand-cyan hover:text-brand-black transition-all duration-300 transform hover:scale-110"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-brand-teal/40/50 to-brand-black/50 backdrop-blur-sm rounded-xl p-6 border border-brand-teal/50"
          >
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-brand-teal/20/50 text-brand-white placeholder-brand-muted/70 border border-brand-teal/50 rounded-lg focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-brand-teal/20/50 text-brand-white placeholder-brand-muted/70 border border-brand-teal/50 rounded-lg focus:outline-none focus:border-brand-cyan transition-colors"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-brand-teal/20/50 text-brand-white placeholder-brand-muted/70 border border-brand-teal/50 rounded-lg focus:outline-none focus:border-brand-cyan transition-colors resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform ${
                  isSubmitting
                    ? 'bg-brand-teal/50 cursor-not-allowed text-brand-muted'
                    : 'bg-brand-cyan hover:bg-[#33EBFF] text-brand-black hover:scale-[1.02] shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)]'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;