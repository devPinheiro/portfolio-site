import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Half-width katakana + digits + hex — Matrix-style glyph set */
const GLYPHS =
  'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ' +
  '0123456789ABCDEFﾊﾐﾋｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾜﾀﾉｽﾈﾇﾍｦｱｳｵｴｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'

const FONT_SIZE = 16
const TRAIL_ALPHA = 0.06
const HEAD_COLOR = '#e8ffe8'
const BODY_COLOR = { r: 0, g: 255, b: 80 } as const

type Drop = {
  y: number
  speed: number
  length: number
  /** Per-segment char index into GLYPHS, refreshed occasionally */
  glyphs: number[]
  swapAcc: number
}

function hashGlyph(col: number, row: number, t: number): number {
  const x = Math.sin(col * 12.9898 + row * 78.233 + t * 0.003) * 43758.5453
  return Math.floor(Math.abs(x)) % GLYPHS.length
}

function initDrop(h: number): Drop {
  const length = Math.floor(10 + Math.random() * 28)
  const glyphs = Array.from({ length }, (_, j) =>
    hashGlyph(0, j, performance.now()),
  )
  return {
    y: Math.random() * -h * 0.5 - length * FONT_SIZE,
    speed: 1.2 + Math.random() * 3.8,
    length,
    glyphs,
    swapAcc: 0,
  }
}

function resizeCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) {
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

export function MatrixRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()
  const dropsRef = useRef<Drop[]>([])
  const colsRef = useRef(0)

  useEffect(() => {
    if (reduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let raf = 0
    let running = true

    const layout = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      resizeCanvas(canvas, ctx, w, h)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)
      const cols = Math.ceil(w / FONT_SIZE)
      colsRef.current = cols
      const prev = dropsRef.current
      dropsRef.current = Array.from({ length: cols }, (_, i) => {
        if (prev[i]) return prev[i]
        const d = initDrop(h)
        d.y += (i % 17) * 24
        return d
      })
      if (dropsRef.current.length > cols) {
        dropsRef.current = dropsRef.current.slice(0, cols)
      }
    }

    layout()
    window.addEventListener('resize', layout)

    const onVis = () => {
      running = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVis)

    let last = performance.now()
    let firstFrame = true

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!running) return

      const dt = Math.min(32, now - last)
      last = now
      const w = window.innerWidth
      const h = window.innerHeight
      const cols = colsRef.current
      const drops = dropsRef.current

      if (firstFrame) {
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, w, h)
        firstFrame = false
      } else {
        ctx.fillStyle = `rgba(0,0,0,${TRAIL_ALPHA})`
        ctx.fillRect(0, 0, w, h)
      }

      ctx.textBaseline = 'top'
      ctx.font = `600 ${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

      for (let i = 0; i < cols; i++) {
        let d = drops[i]
        if (!d) {
          d = initDrop(h)
          drops[i] = d
        }

        d.swapAcc += dt
        if (d.swapAcc > 45) {
          d.swapAcc = 0
          const n = 1 + Math.floor(Math.random() * 4)
          for (let k = 0; k < n; k++) {
            const j = Math.floor(Math.random() * d.length)
            d.glyphs[j] = hashGlyph(i, j, now)
          }
        }

        const x = i * FONT_SIZE

        for (let j = 0; j < d.length; j++) {
          const y = d.y - j * FONT_SIZE
          if (y < -FONT_SIZE || y > h + FONT_SIZE) continue

          const isHead = j === 0
          const tailFalloff = j / Math.max(1, d.length - 1)
          const alpha = isHead ? 1 : Math.max(0.12, 0.92 * (1 - tailFalloff * 0.92))

          if (isHead) {
            ctx.fillStyle = HEAD_COLOR
            ctx.shadowColor = 'rgba(120, 255, 160, 0.9)'
            ctx.shadowBlur = 12
          } else {
            ctx.shadowBlur = 0
            ctx.fillStyle = `rgba(${BODY_COLOR.r},${BODY_COLOR.g},${BODY_COLOR.b},${alpha})`
          }

          const ch = GLYPHS[d.glyphs[j] % GLYPHS.length] ?? '0'
          ctx.fillText(ch, x, y)
        }

        ctx.shadowBlur = 0

        d.y += d.speed * (dt / 16.67)

        if (d.y > h + d.length * FONT_SIZE + 40) {
          drops[i] = initDrop(h)
        }
      }
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', layout)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduceMotion])

  if (reduceMotion) {
    return (
      <div
        className="fixed inset-0 z-6 flex items-center justify-center bg-black px-6 text-center text-sm text-white/70"
        role="img"
        aria-label="Matrix rain animation disabled for reduced motion preference."
      >
        <p>Matrix rain is paused when reduced motion is preferred.</p>
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-6 bg-black"
      aria-hidden
    />
  )
}
