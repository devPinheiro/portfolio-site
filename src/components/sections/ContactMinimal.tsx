import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ContactMinimalProps {
  onContactClick: () => void;
}

export default function ContactMinimal({ onContactClick }: ContactMinimalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const socialSectionRef = useRef<HTMLDivElement>(null);
  const socialTitleRef = useRef<HTMLHeadingElement>(null);
  const socialLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], { y: 60, opacity: 0 });
      gsap.set([socialTitleRef.current], { y: 40, opacity: 0 });
      gsap.set(socialLinksRef.current, { y: 30, opacity: 0 });

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
        duration: 1,
        ease: "power3.out"
      }, "-=0.6")
      .to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")
      .to(socialTitleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.2")
      .to(socialLinksRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.4");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    const tl = gsap.timeline();
    
    tl.to(backgroundRef.current, {
      scale: 1.1,
      duration: 0.4,
      ease: "power2.out"
    })
    .to(textRef.current, {
      x: 8,
      duration: 0.4,
      ease: "power2.out"
    }, 0)
    .to(arrowRef.current, {
      x: 6,
      rotate: 45,
      duration: 0.4,
      ease: "power2.out"
    }, 0);
  };

  const handleMouseLeave = () => {
    const tl = gsap.timeline();
    
    tl.to(backgroundRef.current, {
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    })
    .to([textRef.current, arrowRef.current], {
      x: 0,
      rotate: 0,
      duration: 0.4,
      ease: "power2.out"
    }, 0);
  };

  const handleClick = () => {
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: onContactClick
    });
  };

   const socialLinks = [
    { name: "LinkedIn", url: "https://linkedin.com/in/pinheiro-sam" },
    { name: "GitHub", url: "https://github.com/devpinheiro" },
    { name: "Twitter", url: "https://twitter.com/iampinheirosam" },
    { name: "Instagram", url: "https://instagram.com/iampinheirosamuel" },
    // { name: "Dribbble", url: "https://dribbble.com/samuelpinheiro" }
  ];


  return (
    <section id="contact" ref={containerRef} className="h-screen flex flex-col justify-center items-center bg-white dark:bg-black text-black dark:text-white px-8 transition-colors duration-300">
      <div className="text-center space-y-8">
        <h2 ref={titleRef} className="text-4xl lg:text-6xl font-light tracking-tight">
          Let's create something<br />amazing together
        </h2>
        <p ref={subtitleRef} className="text-lg lg:text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
          Ready to bring your vision to life? Let's discuss your project.
        </p>
        
        {/* Get in touch button */}
        <div className="pt-8">
          <button
            ref={buttonRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden group"
            style={{ 
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              borderRadius: "50px"
            }}
          >
            {/* Background with hover effect */}
            <div 
              ref={backgroundRef}
              className="absolute inset-0 bg-white"
              style={{ borderRadius: "50px" }}
            />
            
            {/* Content */}
            <div className="relative z-10 flex items-center gap-4 px-8 py-4 text-black">
              <span ref={textRef} className="font-medium tracking-wide text-sm uppercase">
                Get in touch
              </span>
              
              {/* Arrow */}
              <div 
                ref={arrowRef}
                className="w-6 h-6 flex items-center justify-center"
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none" 
                  className="text-black"
                >
                  <path 
                    d="M4 12L12 4M12 4H6M12 4V10" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>

        <div ref={socialSectionRef} className="space-y-6 mt-24">
                <h3 ref={socialTitleRef} className="text-xl font-light tracking-tight">Follow me</h3>
                <div className="space-y-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      ref={el => { socialLinksRef.current[index] = el }}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-3 border-b border-gray-300 dark:border-gray-800 hover:border-gray-600 transition-colors duration-300"
                    >
                      <span className="text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                        {social.name}
                      </span>
                      <ArrowUpRight size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white group-hover:rotate-45 transition-all duration-300" />
                    </a>
                  ))}
                </div>
              </div>
      </div>
    </section>
  );
}