import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MenuButtonProps {
  onClick: () => void;
  isOpen: boolean;
  controlsId: string;
}

export default function MenuButton({
  onClick,
  isOpen,
  controlsId,
}: MenuButtonProps) {
  const line1 = useRef<HTMLDivElement>(null);
  const line2 = useRef<HTMLDivElement>(null);
  const line3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.to(line1.current, {
          rotate: 45,
          y: 6,
          duration: 0.3,
          ease: 'power2.inOut',
        });
        gsap.to(line2.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.inOut',
        });
        gsap.to(line3.current, {
          rotate: -45,
          y: -6,
          duration: 0.3,
          ease: 'power2.inOut',
        });
      } else {
        gsap.to([line1.current, line3.current], {
          rotate: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        });
        gsap.to(line2.current, {
          opacity: 1,
          duration: 0.2,
          delay: 0.1,
          ease: 'power2.inOut',
        });
      }
    });

    return () => ctx.revert();
  }, [isOpen]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      className="relative w-8 h-8 flex flex-col justify-center items-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
    >
      <div className="w-full space-y-1.5" aria-hidden="true">
        <div
          ref={line1}
          className="h-0.5 w-full bg-white origin-center transform transition-transform"
        />
        <div
          ref={line2}
          className="h-0.5 w-full bg-white origin-center transform transition-opacity"
        />
        <div
          ref={line3}
          className="h-0.5 w-full bg-white origin-center transform transition-transform"
        />
      </div>
    </button>
  );
}
