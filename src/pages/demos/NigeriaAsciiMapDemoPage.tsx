import { DemoPageShell } from './DemoPageShell'
import { NigeriaMapAsciiDemo } from '../../components/ui/demos/nigeria-map-ascii/NigeriaMapAsciiDemo'

export function NigeriaAsciiMapDemoPage() {
  return (
    <DemoPageShell
      title="Nigeria ASCII flag"
      description="The national flag as an interactive monospace field — green, white, green stripes with pointer-driven ripple and glyph motion."
    >
      <div className="pb-20">
        <NigeriaMapAsciiDemo />
      </div>
    </DemoPageShell>
  )
}
