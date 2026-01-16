import React, { useState } from 'react';
import Hero from '../sections/Hero';
import WorkGallery from '../sections/WorkGallery';
// import About from '../sections/About';
import Brands from '../sections/Brands';
import ContactMinimal from '../sections/ContactMinimal';
import Header from './Header';
import Footer from './Footer';
import ContactOverlay from '../ui/ContactOverlay';

export const Layout: React.FC = () => {
  const [isContactOverlayOpen, setIsContactOverlayOpen] = useState(false);

  const handleContactOpen = () => {
    // setIsContactOverlayOpen(true);
  };

  const handleContactClose = () => {
    setIsContactOverlayOpen(false);
  };

  return (
    <>
      <Header />
      <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen w-full relative transition-colors duration-300">
        <Hero />
        <WorkGallery />
        {/* <About /> */}
        <Brands />
        <ContactMinimal onContactClick={handleContactOpen} />
      </main>
      <Footer />
      
      {/* Contact Overlay */}
      <ContactOverlay 
        isOpen={isContactOverlayOpen} 
        onClose={handleContactClose} 
      />
    </>
  );
};