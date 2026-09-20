// src/components/ui/Footer.tsx
'use client';

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', target: 'home' },
    { label: 'Work', target: 'projects' },
    { label: 'Experience', target: 'experience' },
    { label: 'About', target: 'about' },
    { label: 'Contact', target: 'contact' },
  ];

  return (
    <footer className="border-t border-[#1F1F1F]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top row */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <button
            onClick={() => scrollTo('home')}
            className="group"
            aria-label="Back to top"
          >
            <img
              src="/images/logo-gv.svg"
              alt="Gerald Villaceran"
              className="h-10 w-auto transition-opacity duration-300 group-hover:opacity-80"
            />
          </button>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className="text-sm text-[#6B6355] hover:text-[#F5F0E8] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div className="mt-8 pt-8 border-t border-[#171717] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs text-[#6B6355]">
            &copy; {new Date().getFullYear()} Gerald Villaceran
          </p>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="text-xs text-[#6B6355] hover:text-[#A09882] transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-xs text-[#6B6355] hover:text-[#A09882] transition-colors">
              Terms
            </a>
            <p className="text-xs text-[#6B6355]">Built with Next.js</p>
          </div>
        </div>
      </div>
    </footer>
  );
}