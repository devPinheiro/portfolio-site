import { Loader2, Sparkles, Upload } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ImagePreviewPanel } from './ImagePreviewPanel'
import { ImageWorklist } from './ImageWorklist'
import { RuntimeStatusCard } from './RuntimeStatusCard'
import { ensureSegmenter, getBackendInUse, removeBackgroundWithRmbg } from './rmbgService'
import type { ImageAsset, RuntimeState } from './types'

export function WebAiImageBackgroundRemoverDemo() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imagesRef = useRef<ImageAsset[]>([])
  const [images, setImages] = useState<ImageAsset[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  const [runtime, setRuntime] = useState<RuntimeState>({
    backend: 'wasm',
    phase: 'idle',
    progress: 0,
    message: 'Initializing model...',
  })

  const currentImage = useMemo(
    () => images.find((img) => img.id === selectedId) ?? null,
    [images, selectedId],
  )

  useEffect(() => {
    let isMounted = true
    void (async () => {
      try {
        await ensureSegmenter((next) => {
          if (!isMounted) return
          setRuntime((prev) => ({ ...prev, ...next }))
        })
        if (!isMounted) return
        setRuntime((prev) => ({
          ...prev,
          backend: getBackendInUse(),
          phase: 'ready',
          progress: 100,
          message: 'Model ready. Processing stays fully local in your browser.',
          error: undefined,
        }))
      } catch (error) {
        if (!isMounted) return
        setRuntime((prev) => ({
          ...prev,
          phase: 'error',
          message: 'Model initialization failed.',
          error: `Failed to initialize RMBG-1.4: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        }))
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => {
        URL.revokeObjectURL(img.previewUrl)
        if (img.resultUrl) URL.revokeObjectURL(img.resultUrl)
      })
    }
  }, [])

  const handleSelectFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      const nextFiles = Array.from(files).filter((file) => file.type.startsWith('image/'))
      if (nextFiles.length === 0) return

      Promise.all(
        nextFiles.map(
          (file) =>
            new Promise<ImageAsset>((resolve) => {
              const previewUrl = URL.createObjectURL(file)
              const img = new Image()
              img.onload = () => {
                resolve({
                  id: `${file.name}-${crypto.randomUUID()}`,
                  file,
                  previewUrl,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                  status: 'idle',
                })
              }
              img.onerror = () => {
                resolve({
                  id: `${file.name}-${crypto.randomUUID()}`,
                  file,
                  previewUrl,
                  width: 0,
                  height: 0,
                  status: 'idle',
                })
              }
              img.src = previewUrl
            }),
        ),
      ).then((created) => {
        setImages((prev) => {
          const merged = [...prev, ...created]
          if (!selectedId && merged[0]) setSelectedId(merged[0].id)
          return merged
        })
      })
    },
    [selectedId],
  )

  const processImage = useCallback(async (image: ImageAsset) => {
    setProcessing(image.id)
    setImages((prev) =>
      prev.map((item) =>
        item.id === image.id ? { ...item, status: 'processing', error: undefined } : item,
      ),
    )

    try {
      const blob = await removeBackgroundWithRmbg(image.previewUrl)
      const resultUrl = URL.createObjectURL(blob)

      setImages((prev) =>
        prev.map((item) => {
          if (item.id !== image.id) return item
          if (item.resultUrl) URL.revokeObjectURL(item.resultUrl)
          return { ...item, resultUrl, status: 'done', error: undefined }
        }),
      )
    } catch (error) {
      setImages((prev) =>
        prev.map((item) =>
          item.id === image.id
            ? {
                ...item,
                status: 'error',
                error: error instanceof Error ? error.message : 'Background removal failed.',
              }
            : item,
        ),
      )
    } finally {
      setProcessing(null)
    }
  }, [])

  const handleProcessCurrent = useCallback(async () => {
    if (!currentImage || processing || runtime.phase !== 'ready' || currentImage.resultUrl) return
    await processImage(currentImage)
  }, [currentImage, processImage, processing, runtime.phase])

  const handleProcessAll = useCallback(async () => {
    if (runtime.phase !== 'ready' || processing) return
    const queue = images.filter((img) => !img.resultUrl)
    for (const img of queue) {
      // Sequential processing limits memory usage for big image queues.
      await processImage(img)
    }
  }, [images, processImage, processing, runtime.phase])

  const handleDownload = useCallback((img: ImageAsset) => {
    if (!img.resultUrl) return
    const a = document.createElement('a')
    a.href = img.resultUrl
    a.download = `removed_bg_${img.file.name.replace(/\.[^/.]+$/, '')}.png`
    a.click()
  }, [])

  const handleRemove = useCallback((imageId: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === imageId)
      if (target) {
        URL.revokeObjectURL(target.previewUrl)
        if (target.resultUrl) URL.revokeObjectURL(target.resultUrl)
      }
      const filtered = prev.filter((item) => item.id !== imageId)
      if (selectedId === imageId) setSelectedId(filtered[0]?.id ?? null)
      return filtered
    })
  }, [selectedId])

  return (
    <section aria-label="WebAI image background remover demo">
      <p className="mb-6 max-w-3xl text-sm text-black/65 dark:text-white/65">
        Remove image backgrounds fully in-browser with RMBG-1.4 + WebGPU. Images never leave
        your device.{' '}
        <Link to="/demos" className="underline underline-offset-4 hover:opacity-80">
          Back to demos
        </Link>
      </p>

      <div className="rounded-2xl border border-black/10 bg-white p-6 dark:bg-black dark:border-white/15">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border border-dashed border-black/20 dark:border-white/20 px-4 py-6 text-left hover:bg-black/3 dark:hover:bg-white/3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-black/10 dark:border-white/15 p-2">
                  <Upload className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Upload images</p>
                  <p className="text-xs text-black/60 dark:text-white/60">PNG, JPG, WEBP</p>
                </div>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => handleSelectFiles(event.target.files)}
            />

            <RuntimeStatusCard runtime={runtime} />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void handleProcessCurrent()}
                disabled={!currentImage || !!processing || runtime.phase !== 'ready' || !!currentImage?.resultUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-black text-white dark:bg-white dark:text-black px-3 py-2 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {processing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                Process selected
              </button>
              <button
                type="button"
                onClick={() => void handleProcessAll()}
                disabled={!images.length || !!processing || runtime.phase !== 'ready'}
                className="inline-flex items-center gap-2 rounded-lg border border-black/15 dark:border-white/20 px-3 py-2 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Process all
              </button>
            </div>

            <ImageWorklist
              images={images}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onRemove={handleRemove}
              onDownload={handleDownload}
            />
          </aside>

          <ImagePreviewPanel image={currentImage} />
        </div>
      </div>
    </section>
  )
}
