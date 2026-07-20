// src/app/page.tsx
import ScrollProgress from '@/src/components/ui/ScrollProgress';
import Navigation from '@/src/components/ui/Navigation';
import HeroSection from '@/src/components/sections/HeroSection';
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
    <main className="relative bg-bg-primary min-h-screen">
      <ScrollProgress />
      <Navigation />

      <HeroSection />

      <WaveDivider />
      <ServicesSection />

      <WaveDivider flip />
      <ProjectsSection />

      <WaveDivider />
      <ExperienceSection />

      <WaveDivider flip />
      <ExpertiseSection />

      <WaveDivider />
      <AboutSection />

      <WaveDivider flip />
      <ContactSection />

      <Footer />
    </main>
  );
}