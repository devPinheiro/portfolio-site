import { DemoPageShell } from './DemoPageShell'
import { TestimonialsStories } from '../../components/ui/demos/testimonials-stories/TestimonialsStories'

export function TestimonialsStoriesDemoPage() {
  return (
    <DemoPageShell
      title="Testimonials Stories"
      description="Minimal testimonials timeline with precise motion, navigation, and a single progress bar."
    >
      <div className="pb-20">
        <TestimonialsStories />
      </div>
    </DemoPageShell>
  )
}

