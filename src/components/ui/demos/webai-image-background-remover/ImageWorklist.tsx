import type { ImageAsset } from './types'

interface ImageWorklistProps {
  images: ImageAsset[]
  selectedId: string | null
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onDownload: (image: ImageAsset) => void
}

export function ImageWorklist({
  images,
  selectedId,
  onSelect,
  onRemove,
  onDownload,
}: ImageWorklistProps) {
  return (
    <div className="max-h-[360px] space-y-2 overflow-auto pr-1">
      {images.map((image) => (
        <button
          key={image.id}
          type="button"
          onClick={() => onSelect(image.id)}
          className={`w-full rounded-lg border p-2 text-left transition ${
            selectedId === image.id
              ? 'border-black bg-black/3 dark:border-white dark:bg-white/5'
              : 'border-black/10 dark:border-white/15'
          }`}
        >
          <div className="flex items-center gap-3">
            <img src={image.previewUrl} alt={image.file.name} className="h-10 w-10 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{image.file.name}</p>
              <p className="text-[11px] text-black/60 dark:text-white/60">
                {image.width} x {image.height}
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-wide text-black/60 dark:text-white/60">
              {labelForStatus(image)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-end gap-2">
            {image.resultUrl ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onDownload(image)
                }}
                className="rounded-md border border-black/15 px-2 py-1 text-[11px] dark:border-white/20"
              >
                Download
              </button>
            ) : null}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onRemove(image.id)
              }}
              className="rounded-md border border-black/15 px-2 py-1 text-[11px] dark:border-white/20"
            >
              Remove
            </button>
          </div>
        </button>
      ))}
    </div>
  )
}

function labelForStatus(image: ImageAsset) {
  if (image.status === 'done') return 'done'
  if (image.status === 'processing') return 'running'
  if (image.status === 'error') return 'error'
  return 'new'
}
