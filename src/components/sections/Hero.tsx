import AnimatedText from '../ui/AnimatedText';

export default function Hero() {

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-white dark:bg-black text-black dark:text-white px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex w-full flex-col items-center text-center space-y-5 sm:space-y-6 lg:space-y-8">
          <AnimatedText
            text="Hello 👋"
            delay={5.5}
            className="text-[6vw] sm:text-[6vw] md:text-[6vw] lg:text-8xl font-bold tracking-wide leading-[1.08] sm:leading-tight"
          />
          <div className="flex w-full max-w-5xl flex-row flex-nowrap items-center justify-center gap-x-2 sm:gap-x-3 md:gap-x-5">
            <AnimatedText
              text="I'm"
              delay={5.5}
              className="w-auto max-w-none shrink-0 flex-nowrap text-[clamp(1.35rem,6.5vw,6rem)] sm:text-[8vw] md:text-[6vw] lg:text-8xl font-bold tracking-wide leading-[1.08] sm:leading-tight"
            />
            <AnimatedText
              text="Samuel Pinheiro"
              delay={5.5}
              className="w-auto max-w-none shrink-0 flex-nowrap text-[clamp(1.35rem,6.5vw,6rem)] text-purple-500 sm:text-[8vw] md:text-[6vw] lg:text-8xl font-bold tracking-tight lg:tracking-wide leading-[1.08] sm:leading-tight"
            />
          </div>
          <AnimatedText
            text="experienced software engineer based in Lagos building accessible, design-first products by blending UI, UX, and engineering to create solutions that users adopt and businesses grow from."
            className="max-w-2xl text-base sm:text-lg md:text-2xl lg:text-3xl font-light leading-relaxed text-balance sm:max-w-3xl lg:max-w-5xl"
            delay={5.5}
          />
        </div>
      </div>
    </section>
  );
}
