import { InstantPolaroidDemo } from '../../components/ui/demos/instant-polaroid/InstantPolaroidDemo'
import { DemoPageShell } from './DemoPageShell'

export function InstantPolaroidDemoPage() {
  return (
    <DemoPageShell
      title="Instant Polaroid camera"
      description="Take a real webcam photo in-browser, style it like instant film, and animate the print ejecting from the camera slot."
    >
      <div className="pb-20">
        <InstantPolaroidDemo />
      </div>
    </DemoPageShell>
  )
}
