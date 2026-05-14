"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white py-24 md:py-32 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-brand-cyan hover:text-brand-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Home</span>
        </Link>

        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-cyan/20 flex items-center justify-center border border-brand-cyan/30">
                <Shield className="w-6 h-6 text-brand-cyan" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                Privacy <span className="text-brand-cyan">Policy</span>
              </h1>
            </div>

            <div className="space-y-12 text-brand-muted leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">Introduction</h2>
                <p>
                  At Gerald Villaceran's Portfolio, I respect your privacy and am committed to protecting your personal data. This privacy policy will inform you about how I look after your personal data when you visit my website and tell you about your privacy rights and how the law protects you.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">The Data I Collect</h2>
                <p>
                  I only collect data that you voluntarily provide to me through my contact form. This includes:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                  <li>Full Name</li>
                  <li>Email Address</li>
                  <li>Project Details / Message Content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">How I Use Your Data</h2>
                <p>
                  I use your personal data only to:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                  <li>Respond to your inquiries sent via the contact form.</li>
                  <li>Provide information or services you have requested.</li>
                  <li>Improve my website performance and user experience.</li>
                </ul>
                <p className="mt-4">
                  I do not use your data for marketing purposes unless explicitly requested, and I never sell your data to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">Data Storage & Security</h2>
                <p>
                  Your form submissions are stored securely using Supabase. I implement appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">Third-Party Services</h2>
                <p>
                  I use the following third-party services to operate this website:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                  <li><strong>Vercel:</strong> For hosting and basic, privacy-friendly analytics.</li>
                  <li><strong>Supabase:</strong> For secure database storage.</li>
                  <li><strong>Gmail:</strong> For processing email notifications.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">Contact</h2>
                <p>
                  If you have any questions about this privacy policy or my privacy practices, please contact me at: 
                  <br />
                  <span className="text-brand-cyan font-bold">geraldvillaceran01@gmail.com</span>
                </p>
              </section>

              <div className="pt-12 border-t border-brand-white/10 text-[10px] font-bold tracking-widest uppercase">
                Last Updated: May 2026
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
