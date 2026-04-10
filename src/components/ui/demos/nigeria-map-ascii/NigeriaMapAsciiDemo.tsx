import { Link } from 'react-router-dom'
import { NigeriaFlagAscii } from './NigeriaAsciiMap'

export function NigeriaMapAsciiDemo() {
  return (
    <section aria-label="Nigeria ASCII flag demo">
      <p className="mb-8 max-w-2xl text-sm text-black/65 dark:text-white/65">
        15×5 sparse grid: wide spacing, three readable symbols for green | white
        | green. One flat background colour — no striped “wallpaper”. Hover to
        animate.{' '}
        <Link
          to="/demos"
          className="underline underline-offset-4 hover:opacity-80"
        >
          Back to demos
        </Link>
      </p>
      <NigeriaFlagAscii />
    </section>
  )
}
