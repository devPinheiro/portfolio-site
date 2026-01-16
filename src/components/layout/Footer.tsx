import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
     

    

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      });

      tl
      .to(copyrightRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const currentYear = new Date().getFullYear();



  return (
    <footer ref={containerRef} className="bg-black text-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div ref={copyrightRef} className="pt-8 border-t border-zinc-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Samuel Pinheiro. All rights reserved.
            </p>
             <div className="space-y-3">
              {/* <a 
                href="mailto:hello@samuelpinheiro.dev"
                className="block text-sm text-gray-400 hover:text-white transition-colors duration-300"
              >
                hello@samuelpinheiro.dev
              </a> */}
              {/* <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Available for projects</span>
              </div> */}
            </div>
            <p className="text-xs text-gray-600 tracking-wide">
              Designed & Developed with ❤️ in Lagos
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}