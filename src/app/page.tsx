// src/app/page.tsx
import ScrollProgress from '@/src/components/ui/ScrollProgress';
import Navigation from '@/src/components/ui/Navigation';
import HeroSection from '@/src/components/sections/HeroSection';
import CurrentlyBuildingSection from '@/src/components/sections/CurrentlyBuildingSection';
import ServicesSection from '@/src/components/sections/ServicesSection';
import ProjectsSection from '@/src/components/sections/ProjectsSection';
import ExperienceSection from '@/src/components/sections/ExperienceSection';
import ExpertiseSection from '@/src/components/sections/ExpertiseSection';
import AboutSection from '@/src/components/sections/AboutSection';
import ContactSection from '@/src/components/sections/ContactSection';
import WaveDivider from '@/src/components/ui/WaveDivider';
import Footer from '@/src/components/ui/Footer';

export default function Home() {
  return (
    <>
      <a
        href="#projects"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1000] focus:rounded-full focus:bg-[#D4AF37] focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#060606]"
      >
        Skip to work
      </a>

      <main className="relative bg-bg-primary min-h-screen">
        <ScrollProgress />
        <Navigation />

        <HeroSection />

        <CurrentlyBuildingSection />

        <WaveDivider />
        <ServicesSection />

        <WaveDivider />
        <ProjectsSection />

        <WaveDivider />
        <ExperienceSection />

        <WaveDivider />
        <ExpertiseSection />

        <WaveDivider />
        <AboutSection />

        <WaveDivider />
        <ContactSection />

        <Footer />
      </main>
    </>
  );
}
