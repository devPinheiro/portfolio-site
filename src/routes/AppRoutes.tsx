import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { DemosIndexPage } from '../pages/demos/DemosIndexPage'
import { TestimonialsStoriesDemoPage } from '../pages/demos/TestimonialsStoriesDemoPage'
import { MarqueeDemoPage } from '../pages/demos/MarqueeDemoPage'
import { NigeriaAsciiMapDemoPage } from '../pages/demos/NigeriaAsciiMapDemoPage'
import { MatrixRainDemoPage } from '../pages/demos/MatrixRainDemoPage'
import { ImageAsciiDemoPage } from '../pages/demos/ImageAsciiDemoPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/demos" element={<DemosIndexPage />} />
      <Route
        path="/demos/testimonials-stories"
        element={<TestimonialsStoriesDemoPage />}
      />
      <Route path="/demos/infinite-marquee" element={<MarqueeDemoPage />} />
      <Route path="/demos/nigeria-ascii-map" element={<NigeriaAsciiMapDemoPage />} />
      <Route path="/demos/matrix-rain" element={<MatrixRainDemoPage />} />
      <Route path="/demos/image-ascii" element={<ImageAsciiDemoPage />} />
    </Routes>
  )
}

