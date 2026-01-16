import AnimatedText from '../ui/AnimatedText';

export default function Hero() {

  return (
    <section id="home" className="relative h-screen flex flex-col justify-center items-center overflow-hidden bg-white dark:bg-black text-black dark:text-white px-4 transition-colors duration-300">
      <div className="max-w-7xl w-full mx-auto">
        
        {/* Main content */}
        <div className="text-center lg:space-y-8 ">
          
          
          {/* Name - Large, prominent */}
          <AnimatedText text="Hello 👋" delay={5.5}  className="text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-8xl font-bold tracking-wide leading-relaxed "
          />
          <div className="flex justify-center flex-col lg:flex-row lg:space-x-4  lg:space-y-0">
            <AnimatedText text="I'm" delay={5.5}  className="text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-8xl font-bold tracking-wide leading-relaxed "
            />
            <AnimatedText text="Samuel Pinheiro" delay={5.5}  className="text-[10vw] text-purple-500 sm:text-[8vw] md:text-[6vw] lg:text-8xl font-bold tracking-tight lg:tracking-wide leading-relaxed "
            />
          </div>
          
          
          {/* Animated Value proposition */}
          <AnimatedText 
            text="experienced software engineer based in Lagos building accessible, design-first products by blending UI, UX, and engineering to create solutions that users adopt and businesses grow from."
            className="text-lg md:text-2xl lg:text-3xl font-light leading-relaxed max-w-6xl mx-auto"
            delay={5.5}
          />
          
        </div>

      </div>
    </section>
  );
}
