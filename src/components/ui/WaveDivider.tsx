// src/components/ui/WaveDivider.tsx
'use client';

interface WaveDividerProps {
  className?: string;
}

export default function WaveDivider({ className = '' }: WaveDividerProps) {
  return (
    <div className={`w-full py-4 md:py-6 pointer-events-none ${className}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-4">
        {/* Left line — fades in from transparent */}
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-[#D4AF37]/15" />

        {/* Center accent — small diamond */}
        <div className="relative flex items-center justify-center">
          <div className="w-2 h-2 rotate-45 border border-[#D4AF37]/30 bg-[#D4AF37]/5" />
        </div>

        {/* Right line — fades out to transparent */}
        <div className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/15 via-[#D4AF37]/20 to-transparent" />
      </div>
    </div>
  );
}
