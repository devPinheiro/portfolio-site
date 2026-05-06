import { ImageIcon } from 'lucide-react'
import type { ImageAsset } from './types'

interface ImagePreviewPanelProps {
  image: ImageAsset | null
}

const checkerboardBackground = {
  backgroundImage:
    'linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.08) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.08) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.08) 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
}

export function ImagePreviewPanel({ image }: ImagePreviewPanelProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-black/60 dark:text-white/60">Original</p>
        <div className="aspect-video rounded-lg border border-black/10 bg-black/3 dark:border-white/15 dark:bg-white/3 overflow-hidden flex items-center justify-center">
          {image ? (
            <img src={image.previewUrl} alt={image.file.name} className="max-h-full max-w-full object-contain" />
          ) : (
            <EmptyState label="Select an image to preview" />
          )}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-black/60 dark:text-white/60">
          Result (transparent PNG)
        </p>
        <div
          className="aspect-video rounded-lg border border-black/10 dark:border-white/15 overflow-hidden flex items-center justify-center"
          style={checkerboardBackground}
        >
          {image?.resultUrl ? (
            <img src={image.resultUrl} alt="Background removed result" className="max-h-full max-w-full object-contain" />
          ) : (
            <EmptyState label="Process an image to view result" />
          )}
        </div>
      </div>
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
