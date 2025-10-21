import React, { useState, useEffect, useRef } from "react";

export function useSectionFocus(sectionsLength) {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);

  // Réinitialise les refs quand sectionsLength change
  useEffect(() => {
    sectionRefs.current = Array(sectionsLength)
      .fill()
      .map((_, i) => sectionRefs.current[i] || React.createRef());
  }, [sectionsLength]);

  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIdx = 0;
      let closestDistance = Infinity;

      sectionRefs.current.forEach((ref, idx) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const distance = Math.abs(sectionCenter - viewportCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIdx = idx;
          }
        }
      });

      setActiveSection(closestIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Appel initial pour bien définir la section active au chargement
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionsLength]);

  return { sectionRefs, activeSection, setActiveSection };
}
