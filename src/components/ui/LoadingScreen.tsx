import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// 3 Nigerian languages with "Welcome" translations
const nigerianWelcomes = [
  { language: "Yoruba", text: "Ẹ kú àbọ̀", },
  { language: "Igbo", text: "Nnọọ"},
  { language: "Hausa", text: "Barka da zuwa" }
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial entrance animation
      gsap.from(containerRef.current, {
        opacity: 0,
        duration: 2.8,
        ease: "power2.out"
      });

      // Start the language cycling
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % nigerianWelcomes.length;
          
          // Animate text change
          const tl = gsap.timeline();
          
          tl.to([textRef.current], {
            y: -30,
            opacity: 0,
            duration: 0.6,
            ease: "power2.in"
          })
          .set([textRef.current], {
            y: 30
          })
          .to([textRef.current], {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power2.out",
            stagger: 0.1
          });

          return nextIndex;
        });

        setProgress((prev) => {
          const newProgress = prev + (100 / nigerianWelcomes.length);
          return Math.min(newProgress, 100);
        });
      }, 2000); // 1 second per language for better visibility

      // Complete loading after all languages
      setTimeout(() => {
        clearInterval(interval);
        
        // Exit animation
        const exitTl = gsap.timeline({
          onComplete: () => {
            onComplete();
          }
        });

        exitTl.to(progressBarRef.current, {
          width: "100%",
          duration: 0.5,
          ease: "power2.out"
        })
        .to([textRef.current], {
          y: -50,
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
          stagger: 0.1
        }, "-=0.3")
        .to(overlayRef.current, {
          y: "-100%",
          duration: 1.2,
          ease: "power4.inOut"
        }, "-=0.2");

      }, nigerianWelcomes.length * 1000 + 1000); // Extra second for completion

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  const currentWelcome = nigerianWelcomes[currentIndex];

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-black flex flex-col justify-center items-center text-white"
    >
      <div ref={containerRef} className="text-center space-y-8 max-w-2xl px-8">
        
        {/* Main welcome text */}
        <div ref={textRef} className="overflow-hidden">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight">
            {currentWelcome.text}
          </h1>
        </div>

        {/* Language name */}
        {/* <div ref={languageRef} className="overflow-hidden">
          <p className="text-xl md:text-2xl font-normal tracking-wider uppercase text-gray-400">
            {currentWelcome.language}
          </p>
        </div> */}

        {/* Country */}
        {/* <div ref={countryRef} className="overflow-hidden">
          <p className="text-sm md:text-base font-light tracking-wide text-gray-500">
            {currentWelcome.country}
          </p>
        </div> */}

      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-64">
        <div className="w-full h-px bg-gray-800">
          <div 
            ref={progressBarRef}
            className="h-full bg-white transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs tracking-widest uppercase text-gray-600 mt-4 text-center">
          Loading Experience
        </p>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
    </div>
  );
}