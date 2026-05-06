import type { RuntimeState } from './types'

interface RuntimeStatusCardProps {
  runtime: RuntimeState
}

export function RuntimeStatusCard({ runtime }: RuntimeStatusCardProps) {
  return (
    <div className="rounded-xl border border-black/10 p-3 dark:border-white/15 space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60">
        Runtime
      </p>
      <p className="text-sm">
        {runtime.backend === 'webgpu' ? 'WebGPU acceleration' : 'WebAssembly fallback'}
      </p>
      <p className="text-xs text-black/60 dark:text-white/60">{runtime.message}</p>
      <div className="h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div
          className="h-full bg-black transition-all duration-300 dark:bg-white"
          style={{ width: `${runtime.progress}%` }}
        />
      </div>
      {runtime.error ? <p className="text-xs text-red-600 dark:text-red-400">{runtime.error}</p> : null}
    </div>
  )
}
