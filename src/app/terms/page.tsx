"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-white py-24 md:py-32 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[120px]" />
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
              <div className="w-12 h-12 rounded-2xl bg-brand-teal/20 flex items-center justify-center border border-brand-teal/30">
                <FileText className="w-6 h-6 text-brand-teal" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                Terms of <span className="text-brand-teal">Service</span>
              </h1>
            </div>

            <div className="space-y-12 text-brand-muted leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">Agreement to Terms</h2>
                <p>
                  By accessing or using this website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">Intellectual Property Rights</h2>
                <p>
                  The content on this website, including but not limited to text, software, code, projects, graphics, and branding, is the intellectual property of Gerald Villaceran (the developer). You may not reproduce, distribute, or create derivative works from this content without express written permission. 
                </p>
                <p className="mt-4">
                  Project demonstrations are provided for portfolio showcase purposes only.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">Acceptable Use</h2>
                <p>
                  You agree to use the website only for lawful purposes. You are prohibited from:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                  <li>Attempting to interfere with the proper working of the site.</li>
                  <li>Using the contact form to send spam or malicious content.</li>
                  <li>Engaging in data mining, robots, or similar data gathering methods.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">Disclaimer of Warranties</h2>
                <p>
                  This website and its content are provided on an "as is" basis. Gerald Villaceran (the developer) makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability or fitness for a particular purpose.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">Limitation of Liability</h2>
                <p>
                  In no event shall Gerald Villaceran (the developer) be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">Governing Law</h2>
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of the Philippines and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-brand-white uppercase tracking-widest mb-4">Contact</h2>
                <p>
                  If you have any questions about these terms, please contact me at: 
                  <br />
                  <span className="text-brand-teal font-bold">geraldvillaceran01@gmail.com</span>
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
