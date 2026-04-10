import { Link } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { MatrixRainCanvas } from '../../components/ui/demos/matrix-rain/MatrixRainCanvas'

export function MatrixRainDemoPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-black text-white">
        <MatrixRainCanvas />
        <div className="pointer-events-none fixed inset-0 z-15">
          <div className="pointer-events-auto mx-auto max-w-6xl px-6 pt-28 md:px-8 md:pt-32">
            <h1 className="text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_24px_rgba(0,0,0,0.9)] md:text-4xl">
              Matrix rain
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)] md:text-base">
              Full-viewport HTML canvas: semi-transparent trail clears, independent
              columns, bright heads, and occasional glyph swaps — tuned for smooth
              motion at device pixel ratio.
            </p>
            <Link
              to="/demos"
              className="mt-6 inline-block text-sm font-medium text-emerald-300 underline decoration-emerald-500/60 underline-offset-4 transition-colors hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              ← Back to demos
            </Link>
          </div>
        </div>
      </main>
      <div className="relative z-20 border-t border-white/10 bg-black">
        <Footer />
      </div>
    </>
  )
}
