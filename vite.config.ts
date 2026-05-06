import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Pre-bundling @huggingface/transformers breaks ONNX Runtime Web WASM paths
  // (see addyosmani/bg-remove vite.config.js — exclude from dependency optimizer).
  optimizeDeps: {
    exclude: ['@huggingface/transformers'],
  },
})
