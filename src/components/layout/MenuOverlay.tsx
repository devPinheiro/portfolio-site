import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'Twitter', href: 'https://twitter.com' },
];

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const overlay = useRef<HTMLDivElement>(null);
  const menuContainer = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const socialItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true });

      tl.current
        .set(overlay.current, { display: 'block' })
        .fromTo(overlay.current, 
          { 
            clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
          },
          { 
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 0.8,
            ease: "power4.inOut"
          }
        )
        .fromTo(menuItemsRef.current,
          {
            y: 100,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out"
          },
          "-=0.4"
        )
        .fromTo(socialItemsRef.current,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out"
          },
          "-=0.3"
        );
    }, overlay);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isOpen) {
      tl.current?.play();
      document.body.style.overflow = 'hidden';
    } else {
      tl.current?.reverse();
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleItemClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(href, '_blank');
    }
    onClose();
  };

  return (
    <div 
      ref={overlay}
      className="fixed inset-0 z-40 bg-black text-white hidden"
      style={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
    >
      <div 
        ref={menuContainer}
        className="h-full w-full flex flex-col justify-center items-center relative px-8"
      >
        <nav className="text-center">
          <ul className="space-y-8">
            {menuItems.map((item, index) => (
              <li 
                key={item.label}
                ref={el => { menuItemsRef.current[index] = el; }}
                className="overflow-hidden"
              >
                <button
                  onClick={() => handleItemClick(item.href)}
                  className="text-6xl md:text-8xl font-light tracking-tight uppercase hover:italic transition-all duration-300 cursor-pointer group"
                >
                  <span className="block group-hover:skew-x-12 transition-transform duration-500">
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-16 left-8 flex space-x-8">
          {socialLinks.map((link, index) => (
            <a
              key={link.label}
              ref={el => { socialItemsRef.current[index] = el; }}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onClose()}
              className="text-sm tracking-wider uppercase hover:text-gray-300 transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

       
      </div>
    </div>
  );
}