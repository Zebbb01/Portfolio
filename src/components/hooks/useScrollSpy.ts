// src/components/hooks/useScrollSpy.ts
import { useState, useEffect } from 'react';

/**
 * Returns the id of the section currently under the header.
 *
 * `offset` should roughly match the fixed nav height so a section counts as
 * active once its top passes beneath the nav rather than the viewport edge.
 */
const useScrollSpy = (sectionIds: string[], offset = 0) => {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollPosition = window.scrollY + offset + 1;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      // The last section wins once the page is scrolled to the very bottom —
      // a short trailing section is otherwise unreachable.
      let found = atBottom ? sectionIds[sectionIds.length - 1] : '';

      if (!found) {
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const element = document.getElementById(sectionIds[i]);
          if (element && scrollPosition >= element.offsetTop) {
            found = sectionIds[i];
            break;
          }
        }
      }

      setActiveSection((prev) => {
        const next = found || sectionIds[0] || '';
        return next === prev ? prev : next;
      });
    };

    // Coalesce scroll events into one measurement per frame.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sectionIds, offset]);

  return activeSection;
};

export default useScrollSpy;
