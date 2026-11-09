'use client';

// The fixed link at the top of inner pages. It returns to the page the visitor came from,
// and offers the portfolio after a direct visit.
import type { MouseEvent } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { projects } from '@/src/data/portfolioData';
import { cameFrom, placeName } from '@/src/lib/pageTrail';

const PORTFOLIO = '/#projects';

export default function BackLink() {
  const pathname = usePathname();
  const router = useRouter();
  const from = cameFrom(pathname);
  const name = from ? placeName(from, projects) : null;

  const stepBack = (event: MouseEvent) => {
    if (!name || event.metaKey || event.ctrlKey || event.shiftKey) return;
    // A real step back also restores the list's filter and the scroll position.
    event.preventDefault();
    router.back();
  };

  return (
    <Link
      href={from && name && from !== '/' ? from : PORTFOLIO}
      onClick={stepBack}
      className="fixed top-5 left-5 md:top-6 md:left-6 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#060606]/70 backdrop-blur-xl border border-[#1F1F1F] text-[#A09882] hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} aria-hidden="true" />
      <span className="text-xs font-medium tracking-wide">Back to {name ?? 'Portfolio'}</span>
    </Link>
  );
}
