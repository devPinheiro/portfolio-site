const CACHE_NAME = 'rembg-models-cache-v1'

const SHOULD_CACHE = (url) => {
  const isHuggingFaceModel =
    url.hostname.includes('huggingface.co') &&
    (url.pathname.includes('/briaai/RMBG-1.4/') ||
      url.pathname.endsWith('.onnx') ||
      url.pathname.endsWith('.json'))

  const isOrtWasmAsset =
    url.hostname.includes('cdn.jsdelivr.net') &&
    url.pathname.includes('/transformers@') &&
    (url.pathname.includes('ort-wasm') ||
      url.pathname.endsWith('.wasm') ||
      url.pathname.endsWith('.mjs') ||
      url.pathname.endsWith('.js'))

  return isHuggingFaceModel || isOrtWasmAsset
}

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  if (!SHOULD_CACHE(url)) return

  event.respondWith(cacheFirst(event.request))
})

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)
  if (cachedResponse) return cachedResponse

  const networkResponse = await fetch(request)
  if (networkResponse.ok) {
    await cache.put(request, networkResponse.clone())
  }
  return networkResponse
}
