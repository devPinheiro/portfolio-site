import { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuOverlay from './MenuOverlay';
import MenuButton from '../ui/MenuButton';
// import { ThemeToggle } from '../ui/ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 md:p-8 mix-blend-difference bg-white/20 dark:bg-black/20 backdrop-blur-sm transition-colors duration-300"
      >
        <Link
          to="/"
          className="text-black dark:text-white font-bold text-xl tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
          aria-label="Samuel Pinheiro — Home"
        >
          SP.
        </Link>

        {/* <div className="absolute left-1/2 transform -translate-x-1/2">
          <ThemeToggle />
        </div> */}

        <nav aria-label="Primary">
          <MenuButton
            onClick={toggleMenu}
            isOpen={isMenuOpen}
            controlsId="primary-navigation"
          />
        </nav>
      </header>

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
