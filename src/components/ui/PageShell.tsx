// The frame shared by pages outside the home page: the ambient gold glow and the footer.
import React from 'react';
import Footer from './Footer';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#060606] min-h-screen selection:bg-[#D4AF37]/30 selection:text-[#F5F0E8]">
      {/* Ambient gold glow for continuity with the home page */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] max-w-[80vw] max-h-[80vw] bg-[#D4AF37]/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] max-w-[80vw] max-h-[80vw] bg-[#D4AF37]/[0.02] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        {children}
        <Footer />
      </div>
    </div>
  );
}
