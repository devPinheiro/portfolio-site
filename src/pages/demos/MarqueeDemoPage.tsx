import { DemoPageShell } from './DemoPageShell'
import { InfiniteMarqueeDemo } from '../../components/ui/demos/infinite-marquee/InfiniteMarqueeDemo'

export function MarqueeDemoPage() {
  return (
    <DemoPageShell
      title="Infinite marquee"
      description="Three rows, seamless horizontal loops—no jerk when the animation repeats."
    >
      <div className="pb-20">
        <InfiniteMarqueeDemo />
      </div>
    </DemoPageShell>
  )
}
