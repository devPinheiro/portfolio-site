import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'

type MarqueeItem = {
  label: string
  avatarSrc: string
}

type MarqueeRowProps = {
  items: readonly MarqueeItem[]
  durationSec: number
  reverse?: boolean
}

function marqueeAvatarSrc(rowId: string, label: string) {
  const seed = encodeURIComponent(`${rowId}-${label}`)
  return `https://picsum.photos/seed/${seed}/80/80`
}

function MarqueeItemCell({ item }: { item: MarqueeItem }) {
  return (
    <li className="flex shrink-0 items-center gap-3.5 md:gap-4">
      <img
        src={item.avatarSrc}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        decoding="async"
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-black/12 bg-black/4 dark:ring-white/18 dark:bg-white/6 md:h-11 md:w-11"
      />
      <span className="whitespace-nowrap text-sm font-medium tracking-wide text-black/85 dark:text-white/85 md:text-base">
        {item.label}
      </span>
    </li>
  )
}

function MarqueeStrip({
  items,
  id,
}: {
  items: readonly MarqueeItem[]
  id: string
}) {
  return (
    <ul
      className="flex shrink-0 items-center gap-x-12 px-8 md:gap-x-16 md:px-12"
      aria-hidden={id !== 'a'}
    >
      {items.map((item, i) => (
        <MarqueeItemCell key={`${id}-${i}-${item.label}`} item={item} />
      ))}
    </ul>
  )
}

function MarqueeRow({ items, durationSec, reverse }: MarqueeRowProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <div className="border-y border-black/10 py-8 dark:border-white/15">
        <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-10 gap-y-5 px-4">
          {items.map((item, i) => (
            <MarqueeItemCell key={i} item={item} />
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden border-y border-black/10 py-6 dark:border-white/15"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        className={`marquee-track ${reverse ? 'marquee-track--rtl' : ''}`}
        style={
          {
            '--marquee-duration': `${durationSec}s`,
          } as CSSProperties
        }
      >
        <MarqueeStrip items={items} id="a" />
        <MarqueeStrip items={items} id="b" />
      </div>
    </div>
  )
}

const ROW_1_LABELS = [
  'TypeScript',
  'React',
  'Vite',
  'Node.js',
  'PostgreSQL',
  'Tailwind CSS',
  'Framer Motion',
  'WebGL',
  'REST',
  'GraphQL',
] as const

const ROW_2_LABELS = [
  'Design systems',
  'Accessibility',
  'Performance',
  'CI/CD',
  'Testing',
  'API design',
  'Real-time',
  'Edge',
  'Observability',
  'DX',
] as const

const ROW_3_LABELS = [
  'Ship fast',
  'Iterate',
  'Measure',
  'Refine',
  'Document',
  'Collaborate',
  'Prototype',
  'Polish',
  'Scale',
  'Maintain',
] as const

const ROW_1: MarqueeItem[] = ROW_1_LABELS.map((label) => ({
  label,
  avatarSrc: marqueeAvatarSrc('r1', label),
}))

const ROW_2: MarqueeItem[] = ROW_2_LABELS.map((label) => ({
  label,
  avatarSrc: marqueeAvatarSrc('r2', label),
}))

const ROW_3: MarqueeItem[] = ROW_3_LABELS.map((label) => ({
  label,
  avatarSrc: marqueeAvatarSrc('r3', label),
}))

export function InfiniteMarqueeDemo() {
  return (
    <section aria-label="Infinite marquee demo">
      <p className="mb-8 max-w-2xl text-sm text-black/65 dark:text-white/65">
        Three rows loop forever using a duplicated track and a{' '}
        <code className="rounded bg-black/5 px-1 py-0.5 text-xs dark:bg-white/10">
          translate3d(-50%)
        </code>{' '}
        cycle so the seam never “snaps.”{' '}
        <Link
          to="/demos"
          className="underline underline-offset-4 hover:opacity-80"
        >
          Back to demos
        </Link>
      </p>

      <div className="flex flex-col gap-0">
        <MarqueeRow items={ROW_1} durationSec={42} />
        <MarqueeRow items={ROW_2} durationSec={56} reverse />
        <MarqueeRow items={ROW_3} durationSec={38} />
      </div>
    </section>
  )
}
