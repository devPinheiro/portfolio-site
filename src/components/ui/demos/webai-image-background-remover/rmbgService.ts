import { AutoConfig, env, pipeline, RawImage } from '@huggingface/transformers'
import type { PretrainedConfig, PretrainedModelOptions } from '@huggingface/transformers'
import type { RuntimeState } from './types'

type BackgroundRemover = (input: string, options?: Record<string, unknown>) => Promise<unknown>

const MODEL_ID = 'briaai/RMBG-1.4'
const DEFAULT_THRESHOLD = 0.5

let segmenterPromise: Promise<BackgroundRemover> | null = null
let backendInUse: RuntimeState['backend'] = 'wasm'
/** After a WebGPU runtime failure, skip WebGPU for the rest of the session. */
let forceWasmOnly = false

function configureOnnxWasmEnv(): void {
  const wasm = env.backends?.onnx?.wasm
  if (!wasm) return
  // Without COOP/COEP (crossOriginIsolated), multi-threaded ORT WASM is invalid.
  wasm.numThreads = 1
}

async function hasUsableWebGpuAdapter(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.gpu) return false
  try {
    const adapter = await navigator.gpu.requestAdapter()
    return adapter != null
  } catch {
    return false
  }
}

function invalidateSegmenter(reason?: string): void {
  if (reason && typeof console !== 'undefined' && console.warn) {
    console.warn('[rmbg]', reason)
  }
  segmenterPromise = null
}

/**
 * BRIA's RMBG-1.4 `config.json` sets `model_type` to the **PyTorch class name**
 * (`SegformerForSemanticSegmentation`). Transformers.js expects the **hub registry key**
 * (`segformer`) when matching `AutoModelForSemanticSegmentation`.
 */
async function resolveRmbgPipelineConfig(
  modelId: string,
  options: PretrainedModelOptions,
): Promise<PretrainedConfig> {
  const hubConfig = await AutoConfig.from_pretrained(modelId, options)
  if (hubConfig.model_type === 'SegformerForSemanticSegmentation') {
    hubConfig.model_type = 'segformer'
  }
  return hubConfig
}

/**
 * Use the `background-removal` task (not `image-segmentation`): the latter is typed
 * `multimodal` and always probes tokenizer files — RMBG has none, so you get 404 noise
 * and broken metadata passes. `background-removal` is typed `image` and skips tokenizer.
 *
 * We load **quantized** ONNX (`model_quantized.onnx`, dtype `q8`) for every device so
 * the first fetch is ~44MB instead of ~176MB for `model.onnx`, which often fails on slow
 * links or when a service worker mishandles large LFS responses.
 */
async function createBackgroundRemovalPipeline(
  device: 'webgpu' | 'wasm',
  progress_callback: ((e: { status?: string; progress?: number }) => void) | null,
): Promise<BackgroundRemover> {
  const pretrainedOptions: PretrainedModelOptions = {
    progress_callback: progress_callback ?? undefined,
    revision: 'main',
    device,
    dtype: 'q8',
    subfolder: 'onnx',
    session_options: {},
  }

  const config = await resolveRmbgPipelineConfig(MODEL_ID, pretrainedOptions)

  return (await pipeline('background-removal', MODEL_ID, {
    ...pretrainedOptions,
    config,
  })) as BackgroundRemover
}

/**
 * Bootstraps RMBG-1.4 in browser with WebGPU first and WASM fallback.
 * This singleton avoids downloading and compiling the model multiple times.
 */
export async function ensureSegmenter(
  onRuntimeUpdate: (next: Partial<RuntimeState>) => void,
): Promise<BackgroundRemover> {
  if (segmenterPromise) return segmenterPromise

  segmenterPromise = (async () => {
    env.allowLocalModels = false
    env.useBrowserCache = true
    configureOnnxWasmEnv()

    const progress_callback = (progressEvent: { status?: string; progress?: number }) => {
      const progress = Math.max(0, Math.min(100, Math.round((progressEvent.progress ?? 0) * 100)))
      onRuntimeUpdate({
        phase: 'loading',
        progress,
        message: progressEvent.status ? String(progressEvent.status) : 'Loading model assets...',
      })
    }

    const tryWebGpu = !forceWasmOnly && (await hasUsableWebGpuAdapter())
    if (tryWebGpu) {
      try {
        backendInUse = 'webgpu'
        return await createBackgroundRemovalPipeline('webgpu', progress_callback)
      } catch {
        backendInUse = 'wasm'
        return await createBackgroundRemovalPipeline('wasm', progress_callback)
      }
    }

    backendInUse = 'wasm'
    return createBackgroundRemovalPipeline('wasm', progress_callback)
  })()

  try {
    return await segmenterPromise
  } catch (error) {
    segmenterPromise = null
    throw error
  }
}

export function getBackendInUse(): RuntimeState['backend'] {
  return backendInUse
}

export async function removeBackgroundWithRmbg(imageUrl: string): Promise<Blob> {
  const runOnce = async () => {
    const segmenter = await ensureSegmenter(() => {})
    const out = await segmenter(imageUrl, { threshold: DEFAULT_THRESHOLD })
    if (out instanceof RawImage) {
      const blob = await out.toBlob('image/png')
      if (!blob) throw new Error('Failed to encode transparent PNG from model output.')
      return blob
    }
    throw new Error('Unexpected background-removal output type.')
  }

  try {
    return await runOnce()
  } catch (error) {
    if (getBackendInUse() === 'webgpu' && !forceWasmOnly) {
      forceWasmOnly = true
      invalidateSegmenter(
        'WebGPU inference failed; retrying with WASM. ' +
          (error instanceof Error ? error.message : String(error)),
      )
      return runOnce()
    }
    throw error
  }
}
