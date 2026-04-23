import { DemoPageShell } from './DemoPageShell'
import { WebglSneezeMasonryDemo } from '../../components/ui/demos/webgl-sneeze-masonry/WebglSneezeMasonryDemo'

export function WebglSneezeMasonryDemoPage() {
  return (
    <DemoPageShell
      title="Kinetic WebGL image gallery"
      description="Codrops-adjacent motion study in OGL: GLSL textured planes with drag- and wheel-driven inertia, chromatic warp tied to speed, and shuffle-ready random photos. Switch between a flat carousel, a cylindrical 3D reel, orbit, or wave—respects reduced motion when enabled."
    >
      <div className="pb-20">
        <WebglSneezeMasonryDemo />
      </div>
    </DemoPageShell>
  )
}
