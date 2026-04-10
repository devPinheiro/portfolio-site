import { Link } from 'react-router-dom'
import { DemoPageShell } from './DemoPageShell'

const demos = [
  {
    title: 'Testimonials Stories (monochrome)',
    description:
      'A minimalist WhatsApp-status-style testimonials timeline with precise motion, navigation, and a single progress bar.',
    href: '/demos/testimonials-stories',
  },
  {
    title: 'Infinite marquee (3 rows)',
    description:
      'Three seamless horizontal marquees—duplicated track + translate -50% for a fluid loop with no restart jerk.',
    href: '/demos/infinite-marquee',
  },
  {
    title: 'Nigeria ASCII flag',
    description:
      'Full flag as a canvas grid (green–white–green): hover for ripple, rotation, and deterministic glyph swaps across every stripe.',
    href: '/demos/nigeria-ascii-map',
  },
  {
    title: 'Matrix rain (full viewport)',
    description:
      'Canvas digital rain: trail fade, per-column drops, glyph flicker, DPR-aware — pauses when the tab is hidden.',
    href: '/demos/matrix-rain',
  },
]

export function DemosIndexPage() {
  return (
    <DemoPageShell
      title="Demos"
      description="Standalone experiments and UI motion studies (one per page)."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demos.map((demo) => (
          <Link
            key={demo.href}
            to={demo.href}
            className="group rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-black p-6 transition-colors hover:bg-black/3 dark:hover:bg-white/4 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-medium tracking-tight">
                  {demo.title}
                </div>
                <div className="mt-2 text-sm text-black/70 dark:text-white/70">
                  {demo.description}
                </div>
              </div>
              <div className="text-sm text-black/60 dark:text-white/60 transition-transform group-hover:translate-x-0.5">
                →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DemoPageShell>
  )
}

