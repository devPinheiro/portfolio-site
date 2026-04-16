import { DemoPageShell } from './DemoPageShell'
import { ImageAsciiDemo } from '../../components/ui/demos/image-ascii/ImageAsciiDemo'

export function ImageAsciiDemoPage() {
  return (
    <DemoPageShell
      title="Image → ASCII"
      description="Upload any image and generate ASCII art using a canvas downscale + luminance mapping."
    >
      <div className="pb-20">
        <ImageAsciiDemo />
      </div>
    </DemoPageShell>
  )
}

