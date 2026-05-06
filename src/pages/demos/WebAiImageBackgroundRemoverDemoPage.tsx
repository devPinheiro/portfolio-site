import { WebAiImageBackgroundRemoverDemo } from '../../components/ui/demos/webai-image-background-remover/WebAiImageBackgroundRemoverDemo'
import { DemoPageShell } from './DemoPageShell'

export function WebAiImageBackgroundRemoverDemoPage() {
  return (
    <DemoPageShell
      title="WebAI image background remover"
      description="Browser-based RMBG-1.4 demo with WebGPU acceleration: remove image backgrounds locally with no server uploads."
    >
      <div className="pb-20">
        <WebAiImageBackgroundRemoverDemo />
      </div>
    </DemoPageShell>
  )
}
