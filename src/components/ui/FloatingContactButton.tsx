import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FloatingContactButtonProps {
  onClick: () => void;
}

export default function FloatingContactButton({ onClick }: FloatingContactButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial entrance animation
      gsap.from(buttonRef.current, {
        scale: 0,
        opacity: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 2
      });

      // Subtle floating animation
      gsap.to(buttonRef.current, {
        y: -8,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });

    }, buttonRef);

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
    }, 0)
    .to(buttonRef.current, {
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
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
    }, 0)
    .to(buttonRef.current, {
      boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
      duration: 0.4,
      ease: "power2.out"
    }, 0);
  };

  const handleClick = () => {
    // Click animation before triggering
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: onClick
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed bottom-8 right-8 z-40 group relative overflow-hidden"
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
      <div className="relative z-10 flex items-center gap-4 px-6 py-4 text-black">
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
  );
}