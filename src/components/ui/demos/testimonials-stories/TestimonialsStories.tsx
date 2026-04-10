import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  /** Optional image URL; initials used when omitted */
  avatarSrc?: string;
};

const STORY_DURATION_MS = 6500;

const storyTransition: Transition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function TestimonialsStories() {
  const reduceMotion = useReducedMotion();

  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        name: "Ava Chen",
        role: "Product Designer",
        quote:
          "Clean execution. The motion feels intentional, never distracting—exactly the kind of polish that makes a product feel premium.",
      },
      {
        name: "Noah Patel",
        role: "Engineering Manager",
        quote:
          "This is the rare mix: fast, minimal, and still expressive. Navigation is instant and the transitions stay smooth even when you spam next.",
      },
      {
        name: "Mia Rodriguez",
        role: "Founder",
        quote:
          "Monochrome, sharp typography, and perfect rhythm. It communicates trust without trying too hard.",
      },
    ],
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const startAtRef = useRef<number>(performance.now());
  const rafRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);

  const resetTimer = () => {
    startAtRef.current = performance.now();
    pausedAtRef.current = null;
    setProgress(0);
  };

  const goTo = (nextIndex: number) => {
    setActiveIndex(
      ((nextIndex % testimonials.length) + testimonials.length) %
        testimonials.length,
    );
    resetTimer();
  };

  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  useEffect(() => {
    if (reduceMotion) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(1);
      return;
    }

    const tick = (now: number) => {
      if (!isPaused) {
        const elapsed = now - startAtRef.current;
        const p = clamp01(elapsed / STORY_DURATION_MS);
        setProgress(p);
        if (p >= 1) {
          goNext();
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, isPaused, reduceMotion]);

  useEffect(() => {
    const onVisibility = () => {
      if (reduceMotion) return;
      if (document.visibilityState === "hidden") {
        if (!isPaused) setIsPaused(true);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isPaused, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    if (isPaused) {
      pausedAtRef.current = performance.now();
      return;
    }

    if (pausedAtRef.current) {
      const pauseDelta = performance.now() - pausedAtRef.current;
      startAtRef.current += pauseDelta;
      pausedAtRef.current = null;
    }
  }, [isPaused, reduceMotion]);

  const active = testimonials[activeIndex];

  const slideUpPx = 36;
  const easeOut = [0.22, 1, 0.36, 1] as const;
  const quoteVariants = {
    /** Starts below, moves to natural position = reads as sliding up into view */
    enter: {
      y: reduceMotion ? 0 : slideUpPx,
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : {
            duration: storyTransition.duration,
            ease: easeOut,
            delay: 0.08,
          },
    },
    /** Exits slightly upward so the next line can rise from below */
    exit: {
      y: reduceMotion ? 0 : -18,
      opacity: 0,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.35, ease: easeOut },
    },
  };

  const avatarFadeTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: 0.04 };

  return (
    <section aria-label="Testimonials stories demo">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl overflow-hidden border border-black/10 dark:border-white/15 bg-white dark:bg-black">
          {/* progress */}
          <div className="px-5 pt-5">
            <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <motion.div
                className="h-full w-full bg-black dark:bg-white"
                style={{ scaleX: reduceMotion ? 1 : progress, originX: 0 }}
                transition={{ duration: 0.08, ease: "linear" }}
              />
            </div>
          </div>

          {/* content */}
          <div className="px-5 pb-5 pt-8 md:px-8 md:pb-8">
            <div className="flex items-center justify-between gap-4">
              {/* controls: arrows grouped */}
              <div className="flex">
                <div className="inline-flex items-center gap-0 rounded-full">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous testimonial"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-black transition-colors hover:bg-black/4 active:scale-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white dark:hover:bg-white/5 dark:focus-visible:ring-white dark:focus-visible:ring-offset-black"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next testimonial"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-black transition-colors hover:bg-black/4 active:scale-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white dark:hover:bg-white/5 dark:focus-visible:ring-white dark:focus-visible:ring-offset-black"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className=" flex items-center justify-end ">
                <div className="text-xs text-black/60 dark:text-white/60 tabular-nums">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(testimonials.length).padStart(2, "0")}
                </div>
              </div>
            </div>

            <div className="mt-8 relative min-h-[300px] md:min-h-[280px]">
              <div className="absolute inset-0 flex flex-col">
                {/* Quote: slide up into view */}
                <div className="relative mt-8 flex-1 min-h-[140px]">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.blockquote
                      key={activeIndex}
                      variants={quoteVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="absolute inset-0 m-0 text-2xl md:text-3xl leading-tight font-medium tracking-tight text-balance"
                    >
                      {active.quote}
                    </motion.blockquote>
                  </AnimatePresence>
                </div>
                {/* Profile: avatar (fade) + name & title */}
                <div className="flex items-start gap-4">
                  <motion.div
                    key={`avatar-${activeIndex}`}
                    className="shrink-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={avatarFadeTransition}
                  >
                    {active.avatarSrc ? (
                      <img
                        src={active.avatarSrc}
                        alt=""
                        className="h-14 w-14 rounded-full border border-black/15 object-cover dark:border-white/20"
                      />
                    ) : (
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-full border border-black/15 bg-black/4 text-sm font-semibold tracking-tight text-black dark:border-white/20 dark:bg-white/6 dark:text-white"
                        aria-hidden
                      >
                        {initialsFromName(active.name)}
                      </div>
                    )}
                  </motion.div>
                  <motion.div
                    key={`profile-${activeIndex}`}
                    className="min-w-0 pt-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      ...avatarFadeTransition,
                      delay: reduceMotion ? 0 : 0.08,
                    }}
                  >
                    <div className="text-base font-semibold tracking-tight">
                      {active.name}
                    </div>
                    <div className="mt-0.5 text-sm text-black/60 dark:text-white/60">
                      {active.role}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-black/60 dark:text-white/60">
          Tip: Use ←/→ to navigate, space to pause/play.
        </div>
      </div>
    </section>
  );
}
