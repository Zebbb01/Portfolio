// src/components/ui/Navigation.tsx
import React, { useState } from 'react'; // Import useState
import { sections } from '../../data/portfolioData';
import { Menu, X } from 'lucide-react'; // Import icons for hamburger menu

interface NavigationProps {
  activeSection: string;
  isScrolled: boolean;
  scrollToSection: (sectionId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, isScrolled, scrollToSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSectionClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false); // Close menu after clicking a section
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          GV
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => handleSectionClick(section)} // Use handleSectionClick
              className={`capitalize transition-all duration-300 hover:text-blue-400 ${
                activeSection === section ? 'text-blue-400' : 'text-gray-300'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md py-4 mt-2">
          <div className="flex flex-col items-center space-y-4">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => handleSectionClick(section)} // Use handleSectionClick
                className={`capitalize text-lg transition-colors duration-300 hover:text-blue-400 ${
                  activeSection === section ? 'text-blue-400' : 'text-gray-300'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;