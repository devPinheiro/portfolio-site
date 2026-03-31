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
    const n = projects.length;
    const lastIndex = Math.max(1, n - 1);
    const endX = `-${lastIndex * 100}vw`;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { translateX: 0 },
        {
          translateX: endX,
          ease: "none",
          duration: 1,
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: `+=${100 * n}vh`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 0,
            invalidateOnRefresh: true,
            // No snap here — snap fights pin/Lenis and can release the spacer early mid-scrub
          },
        }
      );
    }, triggerRef);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
    <section
      ref={triggerRef}
      id="work"
      className="hidden lg:block min-h-screen w-full overflow-hidden bg-white dark:bg-black text-black dark:text-white transition-colors duration-300"
    >
      <div ref={sectionRef} className="h-screen w-[400vw] flex flex-row relative">
        {projects.map((project, index) => (
          <div key={project.id} className="w-screen h-full flex flex-col justify-center items-center px-12 relative border-r border-white/10">
            <div className="relative group cursor-pointer w-full max-w-6xl mx-auto">
              <div className="mb-8 flex w-full justify-center">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="max-h-[min(60vh,52rem)] w-auto max-w-full object-contain object-center grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-end gap-6">
                <div className="min-w-0">
                  <p className="text-sm uppercase tracking-widest mb-2 text-gray-400">{project.category}</p>
                  <h3 className="text-4xl xl:text-6xl font-bold uppercase">{project.title}</h3>
                </div>
                <a href={project.url} target="_blank" rel="noreferrer" className="shrink-0 w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300" >
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
    </section>
   <section id="work-mobile" className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 flex flex-col gap-24 lg:hidden">
      {projects.map((project, index) => (
          <div key={project.id} className="w-full min-w-0 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 relative border-r border-white/10">
            <div className="relative group cursor-pointer w-full max-w-6xl">
              <div className="mb-8 flex w-full justify-center">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="max-h-[min(40vh,28rem)] w-auto max-w-full object-contain object-center transition-all duration-700 ease-out transform group-hover:scale-105"
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
