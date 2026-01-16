import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Design",
    description: "Crafting intuitive user experiences and beautiful interfaces that engage and convert.",
    details: ["UI/UX Design", "Brand Identity", "Design Systems", "User Research"]
  },
  {
    title: "Development", 
    description: "Building robust, scalable applications with modern technologies and best practices.",
    details: ["Frontend Development", "Full-Stack Solutions", "Performance Optimization", "Technical Architecture"]
  },
  {
    title: "AI",
    description: "Leveraging artificial intelligence to create smarter, more efficient digital experiences.",
    details: ["AI Integration", "Machine Learning", "Automation", "Intelligent Systems"]
  },
  // {
  //   title: "Mentorship",
  //   description: "Guiding developers and designers to reach their potential and achieve their goals.",
  //   details: ["Technical Coaching", "Career Development", "Code Reviews", "Industry Best Practices"]
  // }
];

export default function About() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const serviceItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.src = "/sam.png";
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // Continue even if image fails
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;

    const ctx = gsap.context(() => {
      // Set initial states (no image animations)
      gsap.set([titleRef.current, descriptionRef.current], { y: 60, opacity: 0 });
      gsap.set(serviceItemsRef.current, { y: 40, opacity: 0 });

      // Main entrance animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      })
      .to(descriptionRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.6")
      .to(serviceItemsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      }, "-=0.4");

      // Service items hover animations
      serviceItemsRef.current.forEach((item) => {
        if (item) {
          const title = item.querySelector('.service-title');
          const details = item.querySelectorAll('.service-detail');
          
          item.addEventListener('mouseenter', () => {
            gsap.to(title, { y: -5, duration: 0.3, ease: "power2.out" });
            gsap.to(details, { 
              y: -3, 
              opacity: 1, 
              duration: 0.4, 
              stagger: 0.05, 
              ease: "power2.out" 
            });
          });
          
          item.addEventListener('mouseleave', () => {
            gsap.to(title, { y: 0, duration: 0.3, ease: "power2.out" });
            gsap.to(details, { 
              y: 0, 
              opacity: 0.7, 
              duration: 0.4, 
              stagger: 0.05, 
              ease: "power2.out" 
            });
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [imageLoaded]);

  return (
    <section id="about" ref={containerRef} className="min-h-screen bg-white text-black py-24 px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-1 place-items-center gap-16 lg:gap-24 items-start mb-32">
          
          {/* Left Column - Image */}
          {/* <div className="relative">
            <div className="relative overflow-hidden bg-gray-100">
              <img 
                ref={imageRef}
                src="/sam.png" 
                alt="Samuel Pinheiro" 
                className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
                style={{ 
                  opacity: imageLoaded ? 1 : 0
                }}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400">Loading...</div>
                </div>
              )}
            </div>
            <div className="mt-6">
              <p className="text-sm tracking-wider uppercase text-gray-500">
                Located in L
              </p>
            </div>
          </div> */}

          {/* Right Column - Content */}
          <div className="space-y-12">
            
            {/* Title */}
            {/* <div className="space-y-6">
              <h2 ref={titleRef} className="text-4xl lg:text-6xl font-light tracking-tight leading-tight">
                Creative Developer &<br />
                Digital Architect
              </h2>
              
              <p ref={descriptionRef} className="text-lg lg:text-xl leading-relaxed text-gray-600 max-w-lg">
                The combination of my passion for design, code & AI positions me in a unique place in the digital world. 
                I help brands stand out in the digital era through innovative solutions.
              </p>
            </div>

            {/* Philosophy Quote */}
            <div className="border-l-2 border-black pl-8">
              <blockquote className="text-2xl lg:text-3xl font-light leading-relaxed italic">
                "No nonsense, always on the cutting edge. Together we will set the new status quo."
              </blockquote>
            </div> 

          </div>
        </div>

        {/* Services Section */}
        <div ref={servicesRef} className="space-y-16">
          
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h3 className="text-3xl lg:text-5xl font-light tracking-tight">
              I can help you with
            </h3>
            <div className="w-24 h-px bg-black mx-auto"></div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={service.title}
                ref={el => { serviceItemsRef.current[index] = el }}
                className="group cursor-pointer space-y-6 p-8 hover:bg-gray-50 transition-colors duration-500"
              >
                
                {/* Service Number */}
                <div className="text-6xl font-light text-gray-200 group-hover:text-black transition-colors duration-500">
                  0{index + 1}
                </div>

                {/* Service Title */}
                <h4 className="service-title text-2xl font-normal tracking-tight">
                  {service.title}
                </h4>

                {/* Service Description */}
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Service Details */}
                <div className="space-y-2 opacity-70">
                  {service.details.map((detail, idx) => (
                    <p key={idx} className="service-detail text-sm text-gray-500 tracking-wide">
                      {detail}
                    </p>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}