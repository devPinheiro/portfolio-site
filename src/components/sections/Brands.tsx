import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Brands() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const marqueeRef1 = useRef<HTMLDivElement>(null);
  const marqueeRef2 = useRef<HTMLDivElement>(null);
  const marqueeRef3 = useRef<HTMLDivElement>(null);

  // Sample brands - replace with actual logos and companies
  const brands = [
    { name: "lightway", logo: "https://res.cloudinary.com/appnet/image/upload/v1768256517/nickel/lightway.webp" },
    { name: "mediaseal", logo: "https://res.cloudinary.com/appnet/image/upload/v1768256516/nickel/mediaseal.webp" },
    { name: "payfi", logo: "https://res.cloudinary.com/appnet/image/upload/v1768256516/nickel/payfi.webp" },
    { name: "safegate", logo: "https://res.cloudinary.com/appnet/image/upload/v1768256516/nickel/safegate.webp" },
    { name: "tavistein", logo: "https://res.cloudinary.com/appnet/image/upload/v1768256516/nickel/tavistein.webp" },
    { name: "nexxt", logo: "https://res.cloudinary.com/appnet/image/upload/v1768257125/nickel/nexxt_logo.svg" },
    { name: "multiskill", logo: "https://res.cloudinary.com/appnet/image/upload/v1768257125/nickel/Multiskills_Logo.png" },
    { name: "maraboo", logo: "https://res.cloudinary.com/appnet/image/upload/v1768257125/nickel/Maraboo_Header_Logo.svg" },
    { name: "notchup", logo: "https://res.cloudinary.com/appnet/image/upload/v1768257125/nickel/Notchup_Logo.svg" },
    { name: "creact", logo: "https://res.cloudinary.com/appnet/image/upload/v1768257125/nickel/Creact_Digital_Agency_Logo.png" },
    // { name: "nickel", logo: "https://res.cloudinary.com/appnet/image/upload/v1714697235/nickel/nickel-black.svg" },

  ];

  // Split brands into three rows for variety
  const row1Brands = brands.slice(0, 11);
  // const row2Brands = brands.slice(6, 11);
  // const row3Brands = brands.slice(8, 12);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current], { y: 60, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      })
      .to(subtitleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4");

      // Infinite marquee animations
      // Row 1: Left to right
      gsap.set(marqueeRef1.current, { x: "-100%" });
      gsap.to(marqueeRef1.current, {
        x: "0%",
        duration: 25,
        ease: "none",
        repeat: -1
      });

      // Row 2: Right to left (opposite direction)
      gsap.set(marqueeRef2.current, { x: "0%" });
      gsap.to(marqueeRef2.current, {
        x: "-100%",
        duration: 20,
        ease: "none",
        repeat: -1
      });

      // Row 3: Left to right (slower)
      gsap.set(marqueeRef3.current, { x: "-100%" });
      gsap.to(marqueeRef3.current, {
        x: "0%",
        duration: 30,
        ease: "none",
        repeat: -1
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const BrandCard = ({ brand, index }: { brand: { name: string; logo: string }; index: number }) => (
    <div 
      key={`${brand.name}-${index}`}
      className="group flex items-center justify-center min-w-[200px] h-24 mx-8 px-6 py-4 bg-white backdrop-blur-sm rounded-xl border border-gray-800 hover:border-gray-600 transition-all duration-300"
    >
      <img
        src={brand.logo}
        alt={`${brand.name} logo`}
        className="max-w-24 max-h-12 object-contain group-hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  );

  return (
    <section ref={containerRef} className="py-24 bg-white dark:bg-black text-black dark:text-white overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 ref={titleRef} className="text-3xl lg:text-5xl font-light tracking-tight mb-6">
            Brands that trusted me
          </h2>
          <div className="w-24 h-px bg-black dark:bg-white mx-auto mb-6"></div>
          <p ref={subtitleRef} className="text-lg text-black dark:text-white max-w-2xl mx-auto leading-relaxed">
            Collaborating with industry leaders to create exceptional digital experiences
          </p>
        </div>

        {/* Infinite Marquee Rows */}
        <div className="space-y-8">
          
          {/* Row 1: Left to Right */}
          <div className="relative overflow-hidden">
            <div ref={marqueeRef1} className="flex items-center whitespace-nowrap">
              {[...row1Brands, ...row1Brands, ...row1Brands].map((brand, index) => (
                <BrandCard key={`row1-${index}`} brand={brand} index={index} />
              ))}
            </div>
          </div>

          {/* Row 2: Right to Left */}
          {/* <div className="relative overflow-hidden">
            <div ref={marqueeRef2} className="flex items-center whitespace-nowrap">
              {[...row2Brands, ...row2Brands, ...row2Brands].map((brand, index) => (
                <BrandCard key={`row2-${index}`} brand={brand} index={index} />
              ))}
            </div>
          </div> */}

        

        </div>

        {/* Gradient Overlays for Seamless Effect */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10"></div>

        {/* Bottom Stats */}
        {/* <div className="text-center mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-light text-black dark:text-white">30+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Projects Delivered</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-light text-black dark:text-white">10+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Brands Trusted</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-light text-black dark:text-white">8+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Years Experience</div>
            </div>
          </div>
        </div> */}

      </div>
    </section>
  );
}