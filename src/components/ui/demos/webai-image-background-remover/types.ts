export interface ImageAsset {
  id: string
  file: File
  previewUrl: string
  resultUrl?: string
  width: number
  height: number
  status: 'idle' | 'processing' | 'done' | 'error'
  error?: string
}

export interface RuntimeState {
  backend: 'webgpu' | 'wasm'
  phase: 'idle' | 'loading' | 'ready' | 'error'
  progress: number
  message: string
  error?: string
}
