import type { ImageAsset, RuntimeState } from './types'
import { Loader2, Sparkles, Upload } from 'lucide-react'
import { ensureSegmenter, getBackendInUse, removeBackgroundWithRmbg } from './rmbgService'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ImagePreviewPanel } from './ImagePreviewPanel'
import { ImageWorklist } from './ImageWorklist'
import { Link } from 'react-router-dom'
import { RuntimeStatusCard } from './RuntimeStatusCard'

export function WebAiImageBackgroundRemoverDemo() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imagesRef = useRef<ImageAsset[]>([])
  const processQueueRef = useRef<string[]>([])
  const runtimePhaseRef = useRef<RuntimeState['phase']>('idle')
  const processingRef = useRef<string | null>(null)
  const drainProcessQueueRef = useRef<() => void>(() => {})

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
    runtimePhaseRef.current = runtime.phase
  }, [runtime.phase])

  useEffect(() => {
    processingRef.current = processing
  }, [processing])

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
    if (runtime.phase === 'ready') {
      drainProcessQueueRef.current()
    }
  }, [runtime.phase])

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

  const enqueueProcessing = useCallback((ids: string[]) => {
    if (ids.length === 0) return
    processQueueRef.current.push(...ids)
    drainProcessQueueRef.current()
  }, [])

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
      drainProcessQueueRef.current()
    }
  }, [])

  const drainProcessQueue = useCallback(async () => {
    if (processingRef.current !== null) return
    if (runtimePhaseRef.current !== 'ready') return

    while (processQueueRef.current.length > 0 && processingRef.current === null) {
      const nextId = processQueueRef.current[0]
      const image = imagesRef.current.find((item) => item.id === nextId)
      if (!image || image.resultUrl || image.status === 'processing') {
        processQueueRef.current.shift()
        continue
      }
      processQueueRef.current.shift()
      await processImage(image)
      return
    }
  }, [processImage])

  useEffect(() => {
    drainProcessQueueRef.current = () => {
      void drainProcessQueue()
    }
  }, [drainProcessQueue])

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
        const newIds = created.map((item) => item.id)
        setImages((prev) => [...prev, ...created])
        setSelectedId((prev) => prev ?? created[0]?.id ?? null)
        enqueueProcessing(newIds)
      })
    },
    [enqueueProcessing],
  )

  const handleProcessCurrent = useCallback(async () => {
    if (!currentImage || processing || runtime.phase !== 'ready' || currentImage.resultUrl) return
    enqueueProcessing([currentImage.id])
  }, [currentImage, enqueueProcessing, processing, runtime.phase])

  const handleProcessAll = useCallback(() => {
    if (runtime.phase !== 'ready' || processing) return
    const ids = images.filter((img) => !img.resultUrl).map((img) => img.id)
    enqueueProcessing(ids)
  }, [images, enqueueProcessing, processing, runtime.phase])

  const handleDownload = useCallback((img: ImageAsset) => {
    if (!img.resultUrl) return
    const a = document.createElement('a')
    a.href = img.resultUrl
    a.download = `removed_bg_${img.file.name.replace(/\.[^/.]+$/, '')}.png`
    a.click()
  }, [])

  const handleRemove = useCallback((imageId: string) => {
    processQueueRef.current = processQueueRef.current.filter((id) => id !== imageId)
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
        Remove image backgrounds fully in-browser with RMBG-1.4 — WebGPU on desktop, with a
        WebAssembly fallback on mobile. Upload images to start processing automatically; nothing
        leaves your device.{' '}
        <Link to="/demos" className="underline underline-offset-4 hover:opacity-80">
          Back to demos
        </Link>
      </p>

      <div className="rounded-2xl border border-black/10 bg-white p-6 dark:bg-black dark:border-white/15">
        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr]">
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
              onChange={(event) => {
                handleSelectFiles(event.target.files)
                event.target.value = ''
              }}
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
                onClick={() => handleProcessAll()}
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
            />
          </aside>

          <ImagePreviewPanel
            image={currentImage}
            isProcessing={currentImage?.status === 'processing'}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </section>
  )
}
