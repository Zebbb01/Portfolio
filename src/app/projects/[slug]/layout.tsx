import React from 'react';
import { Metadata } from 'next';
import Navigation from '../../../components/ui/Navigation';
import Footer from '../../../components/ui/Footer';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-brand-black min-h-screen selection:bg-brand-cyan/30 selection:text-brand-white">
      {/* Background blobs for continuity */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-cyan/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-teal/5 blur-[120px] rounded-full" />
      </div>
      
      <div className="relative z-10">
        {children}
        <Footer />
      </div>
    </div>
  );
}
