import { useEffect, useRef } from 'react'

import { useReducedMotion } from 'framer-motion'

/** Dense grid: many columns × rows, step ≈ one em — reads as a packed tile field. */
const COLS = 21
const ROWS = 7
const COLS_PER_STRIPE = COLS / 3

/** Near-touching centres (multipliers on em width / line height). */
const LOOSE_X = 1.02
const LOOSE_Y = 1.06
const PAD = 8

/** Letters per stripe: uppercase greens, lowercase white centre. */
const GLYPH_POOLS: readonly [readonly string[], readonly string[], readonly string[]] = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'],
]

function flagStripe(col: number): 0 | 1 | 2 {
  if (col < COLS_PER_STRIPE) return 0
  if (col < COLS_PER_STRIPE * 2) return 1
  return 2
}

function baseGlyph(row: number, col: number): string {
  const stripe = flagStripe(col)
  const pool = GLYPH_POOLS[stripe]
  return pool[(row * 11 + col * 5 + stripe * 13) % pool.length] ?? pool[0]
}

const GRID: string[][] = Array.from({ length: ROWS }, (_, row) =>
  Array.from({ length: COLS }, (_, col) => baseGlyph(row, col)),
)

function isDarkTheme() {
  return document.documentElement.classList.contains('dark')
}

function glyphColor(stripe: 0 | 1 | 2, dark: boolean): string {
  if (stripe === 1) {
    return dark ? '#94a3b8' : '#475569'
  }
  return dark ? '#4ade80' : '#008751'
}

function danceChar(
  base: string,
  stripe: 0 | 1 | 2,
  row: number,
  col: number,
  elapsedSec: number,
  intensity: number,
): string {
  if (intensity < 0.2) return base
  const pool = GLYPH_POOLS[stripe]
  const phase = elapsedSec * 3.8 + row * 0.4 + col * 0.55
  const flicker = (Math.sin(phase * 2.8) * 0.5 + 0.5) * intensity
  if (flicker < 0.32) return base
  const i =
    Math.floor(Math.abs(Math.sin(phase * 4.1 + elapsedSec * 2.1) * 1000)) %
    pool.length
  return pool[i] ?? base
}

type Layout = {
  fontPx: number
  stepX: number
  stepY: number
  originX: number
  originY: number
  charW: number
  cssW: number
  cssH: number
}

function cellMotion(
  row: number,
  col: number,
  mouse: { x: number; y: number } | null,
  elapsedSec: number,
  layout: Layout,
) {
  const cx = layout.originX + col * layout.stepX
  const cy = layout.originY + row * layout.stepY
  const { cssW, cssH } = layout

  if (!mouse || cssW <= 0 || cssH <= 0) {
    return { tx: 0, ty: 0, rot: 0, scale: 1 as number, intensity: 0 }
  }
  const dx = cx - mouse.x
  const dy = cy - mouse.y
  const dist = Math.hypot(dx, dy)
  const maxDist = Math.min(cssW, cssH) * 0.48
  if (dist > maxDist) {
    return { tx: 0, ty: 0, rot: 0, scale: 1, intensity: 0 }
  }
  const falloff = 1 - dist / maxDist
  const angle = Math.atan2(dy, dx)
  const wave = Math.sin(elapsedSec * 5.2 + row * 0.72 + col * 0.51)
  const wave2 = Math.cos(elapsedSec * 4.1 + row * 0.44 - col * 0.63)
  const ripple =
    Math.sin(dist * 0.072 - elapsedSec * 13) * 5 * falloff * falloff
  const amp = 12 * falloff * falloff
  const ux = Math.cos(angle)
  const uy = Math.sin(angle)
  return {
    tx:
      Math.cos(angle + wave * 1.35) * amp +
      wave2 * 4 * falloff +
      ux * ripple,
    ty:
      Math.sin(angle + wave * 1.35) * amp -
      wave2 * 2.8 * falloff +
      uy * ripple,
    rot: wave * 14 * falloff + ripple * 0.28,
    scale: 1 + 0.1 * falloff * Math.sin(elapsedSec * 5.5 + col * 0.2),
    intensity: falloff * falloff,
  }
}

function measureMaxGlyphWidth(
  ctx: CanvasRenderingContext2D,
  fontPx: number,
): number {
  ctx.font = `${fontPx}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
  const samples = [
    ...GLYPH_POOLS[0],
    ...GLYPH_POOLS[1],
    ...GLYPH_POOLS[2],
  ]
  let w = 0
  for (const ch of samples) {
    w = Math.max(w, ctx.measureText(ch).width)
  }
  return w
}

export function NigeriaFlagAscii() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const hoverRef = useRef(false)
  const originRef = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()

  const layoutRef = useRef<Layout>({
    fontPx: 14,
    stepX: 20,
    stepY: 24,
    originX: 40,
    originY: 40,
    charW: 10,
    cssW: 400,
    cssH: 220,
  })

  useEffect(() => {
    const wrapEl = wrapRef.current
    const canvasEl = canvasRef.current
    if (!wrapEl || !canvasEl) return
    const context2d = canvasEl.getContext('2d', { alpha: true })
    if (!context2d) return

    const host = {
      wrap: wrapEl,
      canvas: canvasEl,
      ctx: context2d as CanvasRenderingContext2D,
    }

    let raf = 0

    function relayout() {
      const maxW = Math.max(300, host.wrap.clientWidth - 16)
      let fontPx = 26

      let layout: Layout | null = null
      while (fontPx >= 11) {
        host.ctx.font = `${fontPx}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
        const charW = measureMaxGlyphWidth(host.ctx, fontPx)
        const stepX = charW * LOOSE_X
        const stepY = fontPx * LOOSE_Y
        const cssW = Math.ceil(PAD * 2 + (COLS - 1) * stepX + charW)
        const cssH = Math.ceil(PAD * 2 + (ROWS - 1) * stepY + fontPx)

        if (cssW <= maxW) {
          layout = {
            fontPx,
            stepX,
            stepY,
            originX: PAD + charW / 2,
            originY: PAD + fontPx / 2,
            charW,
            cssW,
            cssH,
          }
          break
        }
        fontPx -= 1
      }

      if (!layout) {
        fontPx = 11
        host.ctx.font = `${fontPx}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
        const charW = measureMaxGlyphWidth(host.ctx, fontPx)
        const stepX = charW * LOOSE_X
        const stepY = fontPx * LOOSE_Y
        layout = {
          fontPx,
          stepX,
          stepY,
          originX: PAD + charW / 2,
          originY: PAD + fontPx / 2,
          charW,
          cssW: Math.ceil(PAD * 2 + (COLS - 1) * stepX + charW),
          cssH: Math.ceil(PAD * 2 + (ROWS - 1) * stepY + fontPx),
        }
      }

      const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
      host.canvas.style.width = `${layout.cssW}px`
      host.canvas.style.height = `${layout.cssH}px`
      host.canvas.width = Math.floor(layout.cssW * dpr)
      host.canvas.height = Math.floor(layout.cssH * dpr)
      host.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      layoutRef.current = layout
    }

    function paint(elapsedSec: number, interactive: boolean) {
      const layout = layoutRef.current
      const mouse = interactive ? mouseRef.current : null
      const dark = isDarkTheme()
      const { ctx } = host

      ctx.clearRect(0, 0, layout.cssW, layout.cssH)

      ctx.font = `${layout.fontPx}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const base = GRID[row][col]
          const stripe = flagStripe(col)
          const cx = layout.originX + col * layout.stepX
          const cy = layout.originY + row * layout.stepY

          let tx = 0
          let ty = 0
          let rot = 0
          let scale = 1
          let display = base

          if (interactive && mouse && !reduceMotion) {
            const m = cellMotion(row, col, mouse, elapsedSec, layout)
            tx = m.tx
            ty = m.ty
            rot = m.rot
            scale = m.scale
            display = danceChar(
              base,
              stripe,
              row,
              col,
              elapsedSec,
              m.intensity,
            )
          }

          ctx.fillStyle = glyphColor(stripe, dark)

          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate((rot * Math.PI) / 180)
          ctx.scale(scale, scale)
          ctx.translate(tx, ty)
          ctx.fillText(display, 0, 0)
          ctx.restore()
        }
      }
    }

    function drawStatic() {
      paint(0, false)
    }

    function tick(t: number) {
      if (!hoverRef.current || reduceMotion) {
        return
      }
      raf = requestAnimationFrame(tick)
      if (originRef.current === null) originRef.current = t
      const elapsed = (t - originRef.current) / 1000
      paint(elapsed, true)
    }

    const startLoop = () => {
      cancelAnimationFrame(raf)
      originRef.current = null
      raf = requestAnimationFrame(tick)
    }

    const stopLoop = () => {
      cancelAnimationFrame(raf)
      raf = 0
      originRef.current = null
      drawStatic()
    }

    const onPointerEnter = () => {
      hoverRef.current = true
      if (!reduceMotion) startLoop()
      else drawStatic()
    }

    const onPointerLeave = () => {
      hoverRef.current = false
      mouseRef.current = null
      stopLoop()
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = host.canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const ro = new ResizeObserver(() => {
      relayout()
      if (hoverRef.current && !reduceMotion) {
        originRef.current = null
        startLoop()
      } else {
        drawStatic()
      }
    })
    ro.observe(host.wrap)

    relayout()
    drawStatic()

    host.canvas.addEventListener('pointerenter', onPointerEnter)
    host.canvas.addEventListener('pointerleave', onPointerLeave)
    host.canvas.addEventListener('pointermove', onPointerMove)

    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(raf)
        raf = 0
      } else if (hoverRef.current && !reduceMotion) {
        startLoop()
      }
    }
    document.addEventListener('visibilitychange', onVis)

    const mo = new MutationObserver(() => {
      if (!hoverRef.current) drawStatic()
    })
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      host.canvas.removeEventListener('pointerenter', onPointerEnter)
      host.canvas.removeEventListener('pointerleave', onPointerLeave)
      host.canvas.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduceMotion])

  return (
    <div
      ref={wrapRef}
      className="mx-auto max-w-full rounded-md border border-black/15 bg-zinc-100/90 p-5 dark:border-white/10 dark:bg-zinc-900/90 sm:p-6"
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Nigerian flag as a dense letter grid on a transparent canvas. Hover animates."
        className="mx-auto block touch-none cursor-crosshair select-none"
      />
      <p className="mt-4 text-center text-xs text-black/55 dark:text-white/55">
        Transparent canvas; packed A–H / a–h / N–U letter bands. Hover for
        motion.
      </p>
    </div>
  )
}
