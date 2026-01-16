import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, Mail, MapPin, Phone, ArrowUpRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { sendContactEmail } from '../../utils/emailService';

interface ContactOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactOverlay({ isOpen, onClose }: ContactOverlayProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true });

      // Set initial states
      gsap.set(overlayRef.current, { 
        display: 'none',
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
      });
      gsap.set([formRef.current, contactInfoRef.current, closeButtonRef.current], {
        y: 60,
        opacity: 0
      });

      // Animation sequence
      tl.current
        .set(overlayRef.current, { display: 'block' })
        .to(overlayRef.current, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.2,
          ease: "power4.inOut"
        })
        .to(closeButtonRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4")
        .to([formRef.current, contactInfoRef.current], {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        }, "-=0.2");

    }, overlayRef);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setValidationErrors({});
    setErrorMessage('');
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const emailData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: `${formData.company.trim() ? `Company: ${formData.company.trim()}\n\n` : ''}${formData.message.trim()}`
      };
      
      await sendContactEmail(emailData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
      
      // Close overlay after showing success for 2 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black text-white overflow-y-auto"
      style={{ 
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        display: 'none'
      }}
    >
      {/* Close Button */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className="fixed top-8 right-8 z-60 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
      >
        <X size={20} />
      </button>

      {/* Content */}
      <div ref={contentRef} className="min-h-screen py-24 px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-7xl font-light tracking-tight mb-6">
              Let's work together
            </h2>
            <p className="text-xl lg:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Have a project in mind? Let's discuss how we can bring your vision to life with cutting-edge design and development.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left Column - Contact Form */}
            <div>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="overlay-name" className="block text-sm font-normal tracking-wide text-gray-400 mb-3">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="overlay-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full bg-transparent border-b py-4 px-0 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 ${
                        validationErrors.name ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-white'
                      }`}
                      placeholder="Your full name"
                    />
                    {validationErrors.name && (
                      <p className="text-red-400 text-sm mt-2">{validationErrors.name}</p>
                    )}
                  </div>
                  
                  <div className="group">
                    <label htmlFor="overlay-email" className="block text-sm font-normal tracking-wide text-gray-400 mb-3">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="overlay-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full bg-transparent border-b py-4 px-0 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 ${
                        validationErrors.email ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-white'
                      }`}
                      placeholder="your@email.com"
                    />
                    {validationErrors.email && (
                      <p className="text-red-400 text-sm mt-2">{validationErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="overlay-company" className="block text-sm font-normal tracking-wide text-gray-400 mb-3">
                    Company
                  </label>
                  <input
                    type="text"
                    id="overlay-company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-600 py-4 px-0 text-white placeholder-gray-500 focus:border-white focus:outline-none transition-colors duration-300"
                    placeholder="Your company name"
                  />
                </div>

                <div className="group">
                  <label htmlFor="overlay-message" className="block text-sm font-normal tracking-wide text-gray-400 mb-3">
                    Message *
                  </label>
                  <textarea
                    id="overlay-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full bg-transparent border-b py-4 px-0 text-white placeholder-gray-500 focus:outline-none transition-colors duration-300 resize-none ${
                      validationErrors.message ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-white'
                    }`}
                    placeholder="Tell me about your project..."
                  />
                  {validationErrors.message && (
                    <p className="text-red-400 text-sm mt-2">{validationErrors.message}</p>
                  )}
                </div>

                <div className="pt-8 space-y-4">
                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-3 text-red-400 text-sm">
                      <AlertCircle size={16} />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  
                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-3 text-green-400 text-sm">
                      <CheckCircle size={16} />
                      <span>Message sent successfully! I'll get back to you soon.</span>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || submitStatus === 'success'}
                    className="group relative inline-flex items-center gap-3 bg-transparent border border-white px-8 py-4 text-white font-normal tracking-wider uppercase text-sm hover:bg-white hover:text-black transition-all duration-500 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="relative z-10 animate-spin" />
                        <span className="relative z-10">Sending...</span>
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <CheckCircle size={16} className="relative z-10" />
                        <span className="relative z-10">Sent!</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Send Message</span>
                        <ArrowUpRight size={16} className="relative z-10 group-hover:rotate-45 transition-transform duration-300" />
                      </>
                    )}
                    <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                  </button>
                </div>

              </form>
            </div>

            {/* Right Column - Contact Info & Social */}
            <div ref={contactInfoRef} className="space-y-12">
              
              {/* Contact Information */}
              <div className="space-y-8">
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
              <div className="space-y-6">
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

        </div>
      </div>
    </div>
  );
}