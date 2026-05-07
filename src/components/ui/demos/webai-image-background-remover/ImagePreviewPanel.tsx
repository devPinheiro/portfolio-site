import { ImageIcon, Loader2 } from 'lucide-react'
import type { ImageAsset } from './types'

interface ImagePreviewPanelProps {
  image: ImageAsset | null
  isProcessing?: boolean
  processingLabel?: string
}

const checkerboardBackground = {
  backgroundImage:
    'linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.08) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.08) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.08) 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
}

const previewPaneClass =
  'relative min-h-[min(65vh,520px)] rounded-lg border overflow-hidden flex items-center justify-center'

export function ImagePreviewPanel({
  image,
  isProcessing = false,
  processingLabel = 'Removing background…',
}: ImagePreviewPanelProps) {
  const showResultPreview = image && (image.resultUrl || (isProcessing && !image.resultUrl))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <p className="mb-2 text-sm uppercase tracking-wide text-black/60 dark:text-white/60">Original</p>
        <div
          className={`${previewPaneClass} border-black/10 bg-black/3 dark:border-white/15 dark:bg-white/3`}
        >
          {image ? (
            <img src={image.previewUrl} alt={image.file.name} className="max-h-full max-w-full object-contain" />
          ) : (
            <EmptyState label="Upload an image to preview" />
          )}
          {isProcessing ? <ProcessingOverlay label={processingLabel} /> : null}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm uppercase tracking-wide text-black/60 dark:text-white/60">
          Result (transparent PNG)
        </p>
        <div
          className={`${previewPaneClass} border-black/10 dark:border-white/15`}
          style={checkerboardBackground}
        >
          {showResultPreview ? (
            <img
              src={image.resultUrl ?? image.previewUrl}
              alt={image.resultUrl ? 'Background removed result' : image.file.name}
              className={`max-h-full max-w-full object-contain ${isProcessing && !image.resultUrl ? 'opacity-60' : ''}`}
            />
          ) : (
            <EmptyState label="Upload an image to remove its background" />
          )}
          {isProcessing ? <ProcessingOverlay label={processingLabel} /> : null}
        </div>
      </div>
    </div>
  )
}

function ProcessingOverlay({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/40 dark:bg-black/50"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="h-8 w-8 animate-spin text-white" />
      <p className="text-sm font-medium text-white">{label}</p>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="p-6 text-center text-black/50 dark:text-white/50">
      <ImageIcon className="mx-auto mb-2 h-7 w-7" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
