// src/components/ui/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-brand-teal">
      <div className="container mx-auto px-6 text-center">
        <p className="text-brand-muted">
          © 2024 Gerald Villaceran. Built with Next.js and TypeScript.
        </p>
      </div>
    </footer>
  );
};

export default Footer;