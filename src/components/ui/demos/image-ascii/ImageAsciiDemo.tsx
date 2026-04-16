import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'

const DEFAULT_RAMP = '@%#*+=-:. '

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function luminance(r: number, g: number, b: number) {
  // Perceived brightness (Rec. 709)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

async function fileToImageBitmap(file: File) {
  // createImageBitmap is faster & avoids layout; fallback to <img> when unavailable.
  if ('createImageBitmap' in window) {
    return await createImageBitmap(file)
  }

  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = 'async'
    img.loading = 'eager'
    img.src = url
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load image'))
    })

    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth || img.width
    canvas.height = img.naturalHeight || img.height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error('Canvas not supported')
    ctx.drawImage(img, 0, 0)
    return await createImageBitmap(canvas)
  } finally {
    URL.revokeObjectURL(url)
  }
}

type AsciiResult = {
  text: string
  cols: number
  rows: number
}

function bitmapToAscii({
  bitmap,
  cols,
  ramp,
  invert,
  contrast,
}: {
  bitmap: ImageBitmap
  cols: number
  ramp: string
  invert: boolean
  contrast: number // 0.5..2.0
}): AsciiResult {
  const safeCols = clamp(Math.round(cols), 24, 220)

  // Characters are taller than they are wide; compensate to avoid “squashed” output.
  // 0.5–0.6 is a good approximation for most monospace fonts.
  const charAspect = 0.55
  const rows = Math.max(12, Math.round((safeCols * bitmap.height) / bitmap.width * charAspect))

  const canvas = document.createElement('canvas')
  canvas.width = safeCols
  canvas.height = rows
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    return { text: 'Canvas not supported.', cols: safeCols, rows }
  }

  ctx.clearRect(0, 0, safeCols, rows)
  ctx.drawImage(bitmap, 0, 0, safeCols, rows)
  const { data } = ctx.getImageData(0, 0, safeCols, rows)

  const gradient = ramp.length > 0 ? ramp : DEFAULT_RAMP
  const maxIdx = gradient.length - 1

  const c = clamp(contrast, 0.5, 2.0)
  const out: string[] = []
  out.length = rows

  let i = 0
  for (let y = 0; y < rows; y++) {
    let line = ''
    for (let x = 0; x < safeCols; x++) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      // alpha ignored; uploaded images are typically opaque, but this keeps output stable
      i += 4

      let l = luminance(r, g, b) / 255 // 0..1
      l = (l - 0.5) * c + 0.5
      l = clamp(l, 0, 1)
      if (invert) l = 1 - l

      const idx = Math.round(l * maxIdx)
      line += gradient[idx]
    }
    out[y] = line
  }

  return { text: out.join('\n'), cols: safeCols, rows }
}

export function ImageAsciiDemo() {
  const reduceMotion = useReducedMotion()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [cols, setCols] = useState(96)
  const [invert, setInvert] = useState(false)
  const [contrast, setContrast] = useState(1.15)
  const [ramp, setRamp] = useState<string>(DEFAULT_RAMP)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AsciiResult | null>(null)
  const lastBitmapRef = useRef<ImageBitmap | null>(null)
  const outputPanelRef = useRef<HTMLDivElement>(null)
  const [asciiFontPx, setAsciiFontPx] = useState(10)
  const [asciiLinePx, setAsciiLinePx] = useState(11)

  const rampExamples = useMemo(
    () => [
      { label: 'Default', value: DEFAULT_RAMP },
      { label: 'Dense', value: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\\\|()1{}[]?-_+~<>i!lI;:,\\"^`\\\'. ' },
      { label: 'Minimal', value: '@#*+=-:. ' },
    ],
    [],
  )

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    return () => {
      lastBitmapRef.current?.close?.()
      lastBitmapRef.current = null
    }
  }, [])

  const generate = async (pickedFile: File) => {
    setBusy(true)
    setError(null)
    try {
      lastBitmapRef.current?.close?.()
      const bitmap = await fileToImageBitmap(pickedFile)
      lastBitmapRef.current = bitmap
      const ascii = bitmapToAscii({ bitmap, cols, ramp, invert, contrast })
      setResult(ascii)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to generate ASCII.'
      setError(msg)
      setResult(null)
    } finally {
      setBusy(false)
    }
  }

  // Regenerate when controls change (but only if we already have a bitmap)
  useEffect(() => {
    const bitmap = lastBitmapRef.current
    if (!bitmap) return
    setResult(bitmapToAscii({ bitmap, cols, ramp, invert, contrast }))
  }, [cols, ramp, invert, contrast])

  // Keep ASCII output fitting the panel width as cols change.
  useEffect(() => {
    const el = outputPanelRef.current
    if (!el) return

    const compute = () => {
      // Measure available width inside the pre (panel padding is 20, pre padding is 16)
      const panelWidth = el.clientWidth
      const prePaddingX = 32
      const usable = Math.max(160, panelWidth - prePaddingX)

      // Approx monospace glyph width ~0.6em; translate to px budget per column.
      const glyphWidthFactor = 0.62
      const px = usable / Math.max(24, cols) / glyphWidthFactor
      const fontPx = clamp(px, 5.5, 12)
      const linePx = Math.round(fontPx * 1.15 * 10) / 10
      setAsciiFontPx(fontPx)
      setAsciiLinePx(linePx)
    }

    compute()
    const ro = new ResizeObserver(() => compute())
    ro.observe(el)
    return () => ro.disconnect()
  }, [cols])

  const onPickFile = async (f: File | null) => {
    setFile(f)
    setResult(null)
    setError(null)
    if (!f) return
    await generate(f)
  }

  return (
    <section aria-label="Image to ASCII demo">
      <p className="mb-8 max-w-2xl text-sm text-black/65 dark:text-white/65">
        Upload an image, downscale it on a canvas, compute luminance, and map
        brightness to a character ramp. References: Marmelab’s canvas-based
        approach and common ASCII ramps.{' '}
        <Link to="/demos" className="underline underline-offset-4 hover:opacity-80">
          Back to demos
        </Link>
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
        <div
          ref={outputPanelRef}
          className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-black"
        >
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">
              Image file
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90 dark:file:bg-white dark:file:text-black"
                onChange={(e) => {
                  const f = e.currentTarget.files?.[0] ?? null
                  void onPickFile(f)
                }}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                Columns
                <input
                  type="range"
                  min={24}
                  max={220}
                  value={cols}
                  className="mt-2 w-full"
                  onChange={(e) => setCols(parseInt(e.currentTarget.value, 10))}
                />
                <div className="mt-1 text-xs text-black/60 dark:text-white/60">
                  {cols} cols
                </div>
              </label>

              <label className="text-sm">
                Contrast
                <input
                  type="range"
                  min={50}
                  max={200}
                  value={Math.round(contrast * 100)}
                  className="mt-2 w-full"
                  onChange={(e) =>
                    setContrast(parseInt(e.currentTarget.value, 10) / 100)
                  }
                />
                <div className="mt-1 text-xs text-black/60 dark:text-white/60">
                  {contrast.toFixed(2)}×
                </div>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={invert}
                  onChange={(e) => setInvert(e.currentTarget.checked)}
                />
                Invert
              </label>

              <label className="text-sm">
                Ramp
                <select
                  className="ml-2 rounded-lg border border-black/10 bg-white px-2 py-1 text-sm dark:border-white/15 dark:bg-black"
                  value={ramp}
                  onChange={(e) => setRamp(e.currentTarget.value)}
                >
                  {rampExamples.map((ex) => (
                    <option key={ex.label} value={ex.value}>
                      {ex.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                disabled={!file || busy}
                onClick={() => (file ? void generate(file) : undefined)}
                className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {busy ? 'Generating…' : 'Generate'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFile(null)
                  setPreviewUrl(null)
                  setResult(null)
                  setError(null)
                  lastBitmapRef.current?.close?.()
                  lastBitmapRef.current = null
                }}
                className="inline-flex items-center justify-center rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-black/80 hover:bg-black/3 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/5"
              >
                Reset
              </button>
            </div>

            {previewUrl ? (
              <figure className="mt-2">
                <img
                  src={previewUrl}
                  alt={file?.name ? `Preview of ${file.name}` : 'Uploaded preview'}
                  className="w-full rounded-xl border border-black/10 object-contain bg-black/2 dark:border-white/15 dark:bg-white/5"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="mt-2 text-xs text-black/60 dark:text-white/60">
                  Tip: higher columns increases detail but generates more text.
                </figcaption>
              </figure>
            ) : (
              <div className="rounded-xl border border-dashed border-black/20 p-6 text-sm text-black/60 dark:border-white/20 dark:text-white/60">
                Choose an image to generate ASCII art.
              </div>
            )}

            {reduceMotion ? (
              <div className="text-xs text-black/60 dark:text-white/60">
                Reduced motion is enabled — this demo still works, but avoids any
                unnecessary animations.
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-black">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium">ASCII output</div>
            <div className="text-xs text-black/60 dark:text-white/60">
              {result ? `${result.cols}×${result.rows}` : '—'}
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : null}

          <pre
            className="mt-4 max-h-[70vh] overflow-auto rounded-xl border border-black/10 bg-black/3 p-4 font-mono text-black/85 dark:border-white/15 dark:bg-white/5 dark:text-white/90"
            style={{
              fontSize: `${asciiFontPx}px`,
              lineHeight: `${asciiLinePx}px`,
            }}
            aria-live="polite"
          >
            {result?.text ??
              'Upload an image to generate ASCII art. (Output will appear here.)'}
          </pre>

          <div className="mt-3 text-xs text-black/55 dark:text-white/55">
            For best results, use a high-contrast image. If it looks “washed
            out”, increase contrast or try a denser ramp.
          </div>
        </div>
      </div>
    </section>
  )
}

