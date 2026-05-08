// src/components/hooks/useScrollSpy.ts
import { useState, useEffect } from 'react';

const useScrollSpy = (sectionIds: string[], offset = 0) => {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset + 1; // Add 1 to prevent issues at exact boundary

      // Start from the last section and work backwards to find the first one in view
      let newActiveSection = '';
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i];
        const element = document.getElementById(sectionId);

        if (element) {
          const top = element.offsetTop;
          // Check if the current scroll position is at or past the top of the section
          if (scrollPosition >= top) {
            newActiveSection = sectionId;
            break; // Found the active section, so we can exit the loop
          }
        }
      }

      // If no section is found (e.g., at the very top of the page), default to the first section
      if (!newActiveSection && sectionIds.length > 0) {
        newActiveSection = sectionIds[0];
      }

      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    };

    // Set initial active section on component mount
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset, activeSection]);

  return activeSection;
};

export default useScrollSpy;