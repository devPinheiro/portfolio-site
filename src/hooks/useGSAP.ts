import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export const useGSAP = () => {
  const scopeRef = useRef<HTMLDivElement>(null);

  const animateIn = (element: HTMLElement | string, options = {}) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power2.out",
        ...options 
      }
    );
  };

  const animateOut = (element: HTMLElement | string, options = {}) => {
    return gsap.to(element, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: "power2.in",
      ...options
    });
  };

  const floatAnimation = (element: HTMLElement | string, options = {}) => {
    return gsap.to(element, {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      ...options
    });
  };

  const pulseAnimation = (element: HTMLElement | string, options = {}) => {
    return gsap.to(element, {
      scale: 1.05,
      duration: 1.5,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      ...options
    });
  };

  const typewriterAnimation = (element: HTMLElement | string, text: string) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const chars = text.split('');
    el.textContent = '';

    const tl = gsap.timeline();
    chars.forEach((char) => {
      tl.to(el, {
        duration: 0.05,
        ease: "none",
        onComplete: () => {
          el.textContent += char;
        }
      });
    });

    return tl;
  };

  useEffect(() => {
    if (scopeRef.current) {
      // Auto-animate elements with data-animate attribute
      const animatedElements = scopeRef.current.querySelectorAll('[data-animate]');
      animatedElements.forEach((el, index) => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8,
            delay: index * 0.1,
            ease: "power2.out"
          }
        );
      });
    }
  }, []);

  return {
    scopeRef,
    animateIn,
    animateOut,
    floatAnimation,
    pulseAnimation,
    typewriterAnimation,
    gsap
  };
};