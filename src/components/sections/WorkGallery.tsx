import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "MediaSeal WPI",
    category: "Website Redesign",
    image: "https://res.cloudinary.com/appnet/image/upload/v1768306038/media-seal_tg5pn7.gif",
    url: "https://mediaseal-ng.com/"
  },
  {
    id: 2,
    title: "Proscaenia",
    category: "Video Streaming App",
    image: "https://res.cloudinary.com/appnet/image/upload/v1768346662/nickel/p-0.gif",
    url: "https://proscaenia.com/"
  },
  {
    id: 3,
    title: "Maraboo",
    category: "SaaS Cross Border Fintech Dashboard",
    image: "https://res.cloudinary.com/appnet/image/upload/v1768599504/nickel/maraboo-2.png",
    url: "https://mara.boo/"
  },
  {
    id: 4,
    title: "DROHealth",
    category: "SaaS Health Platform",
    image: "https://res.cloudinary.com/appnet/image/upload/v1768523024/nickel/drohealth.png",
    url: "https://drohealth.com/"
  }
];

export default function WorkGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        {
          translateX: 0,
        },
        {
          translateX: "-305vw",
          ease: "none",
          duration: 1,
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: "+=110vh",
            scrub: 1.6,
            pin: true,
            anticipatePin: 1,
          },
        }
      );
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
    <section id="work" className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 hidden lg:flex">
      <div ref={triggerRef} className="overflow-hidden">
      <div ref={sectionRef} className="h-screen w-[400vw] flex flex-row relative">
        {projects.map((project, index) => (
          <div key={project.id} className="w-screen h-full flex flex-col justify-center items-center px-12 relative border-r border-white/10">
            <div className="relative group cursor-pointer">
              <div className="overflow-hidden mb-8">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-[60vh]  grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm uppercase tracking-widest mb-2 text-gray-400">{project.category}</p>
                  <h3 className="text-6xl font-bold uppercase">{project.title}</h3>
                </div>
                <a href={project.url} target='_blank' className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300" >
                  <ArrowUpRight size={32} />
                </a>
              </div>
              <span className="absolute -top-20 -left-20 text-[20vw] font-bold text-black/5 dark:text-white/5 pointer-events-none select-none">
                0{index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
   <section id="work" className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 flex flex-col gap-24 lg:hidden">
      {projects.map((project, index) => (
          <div key={project.id} className="w-screen h-full flex flex-col justify-center items-center px-16 relative border-r border-white/10">
            <div className="relative group cursor-pointer">
              <div className="overflow-hidden mb-8">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-[30vh]   transition-all duration-700 ease-out transform group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2 text-gray-100">{project.category}</p>
                  <h3 className="lg:text-6xl text-2xl font-bold uppercase">{project.title}</h3>
                </div>
                <div className="lg:w-16 lg:h-16 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300" >
                  <ArrowUpRight size={12} />
                </div>
              </div>
              <span className="absolute -top-20 -left-20 text-[20vw] font-bold text-black/5 dark:text-white/5 pointer-events-none select-none">
                0{index + 1}
              </span>
            </div>
          </div>
        ))}
   </section>
    </>
  );
}
