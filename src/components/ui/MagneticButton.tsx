import { useRef, type ReactNode, type MouseEvent } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function MagneticButton({ children, className = '', onClick }: MagneticButtonProps) {
  const magnetic = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = magnetic.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    gsap.to(magnetic.current, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 1,
      ease: "elastic.out(1, 0.3)"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(magnetic.current, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.3)"
    });
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      ref={magnetic}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
