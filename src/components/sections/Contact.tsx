import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current], { y: 60, opacity: 0 });
      gsap.set(formRef.current, { y: 40, opacity: 0 });
      gsap.set([contactInfoRef.current, socialLinksRef.current], { y: 30, opacity: 0 });

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
      .to(subtitleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.6")
      .to(formRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      }, "-=0.4")
      .to([contactInfoRef.current, socialLinksRef.current], {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      }, "-=0.6");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "pinheirolaoluwa@gmail.com",
      link: "mailto:pinheirolaoluwa@gmail.com"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Lagos",
      link: null
    },
    {
      icon: Phone,
      label: "Available for",
      value: "Freelance & Full-time",
      link: null
    }
  ];

   const socialLinks = [
    { name: "LinkedIn", url: "https://linkedin.com/in/pinheiro-sam" },
    { name: "GitHub", url: "https://github.com/devpinheiro" },
    { name: "Twitter", url: "https://twitter.com/iampinheirosam" },
    { name: "Instagram", url: "https://instagram.com/iampinheirosamuel" },
    // { name: "Dribbble", url: "https://dribbble.com/samuelpinheiro" }
  ];

  return (
    <section id="contact" ref={containerRef} className="min-h-screen bg-black text-white py-24 px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 ref={titleRef} className="text-4xl lg:text-6xl font-light tracking-tight mb-6">
            Let's work together
          </h2>
          <p ref={subtitleRef} className="text-lg lg:text-xl text-white max-w-2xl mx-auto leading-relaxed">
            Have a project in mind? Let's discuss how we can bring your vision to life with cutting-edge design and development.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column - Contact Form */}
          <div>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              
              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-normal tracking-wide text-gray-400 mb-3">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent border-b border-gray-600 py-3 px-0 text-white placeholder-gray-500 focus:border-white focus:outline-none transition-colors duration-300"
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-normal tracking-wide text-gray-400 mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent border-b border-gray-600 py-3 px-0 text-white placeholder-gray-500 focus:border-white focus:outline-none transition-colors duration-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="company" className="block text-sm font-normal tracking-wide text-gray-400 mb-3">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-gray-600 py-3 px-0 text-white placeholder-gray-500 focus:border-white focus:outline-none transition-colors duration-300"
                  placeholder="Your company name"
                />
              </div>

              <div className="group">
                <label htmlFor="message" className="block text-sm font-normal tracking-wide text-gray-400 mb-3">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full bg-transparent border-b border-gray-600 py-3 px-0 text-white placeholder-gray-500 focus:border-white focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-8">
                <button
                  type="submit"
                  className="group relative inline-flex items-center gap-3 bg-transparent border border-white px-8 py-4 text-white font-normal tracking-wider uppercase text-sm hover:bg-white hover:text-black transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10">Send Message</span>
                  <ArrowUpRight size={16} className="relative z-10 group-hover:rotate-45 transition-transform duration-300" />
                  <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                </button>
              </div>

            </form>
          </div>

          {/* Right Column - Contact Info & Social */}
          <div className="space-y-12">
            
            {/* Contact Information */}
            <div ref={contactInfoRef} className="space-y-8">
              <h3 className="text-2xl font-light tracking-tight mb-8">Get in touch</h3>
              
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-6 h-6 flex items-center justify-center mt-1">
                      <IconComponent size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{info.label}</p>
                      {info.link ? (
                        <a 
                          href={info.link}
                          className="text-white hover:text-gray-300 transition-colors duration-300"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-white">{info.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div ref={socialLinksRef} className="space-y-6">
              <h3 className="text-2xl font-light tracking-tight">Follow me</h3>
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-3 border-b border-gray-800 hover:border-gray-600 transition-colors duration-300"
                  >
                    <span className="text-white group-hover:text-gray-300 transition-colors duration-300">
                      {social.name}
                    </span>
                    <ArrowUpRight size={16} className="text-gray-600 group-hover:text-white group-hover:rotate-45 transition-all duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="p-8 border border-gray-800 bg-gray-900/20">
              <h4 className="text-lg font-normal mb-4">Currently available</h4>
              <p className="text-gray-400 leading-relaxed mb-6">
                I'm currently accepting new projects and collaborations. 
                Let's discuss how we can work together.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">Available for new projects</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20 pt-12 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            © 2024 Samuel Pinheiro. All rights reserved.
          </p>
        </div>

      </div>
    </section>
  );
}