import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { DemosIndexPage } from '../pages/demos/DemosIndexPage'
import { TestimonialsStoriesDemoPage } from '../pages/demos/TestimonialsStoriesDemoPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/demos" element={<DemosIndexPage />} />
      <Route
        path="/demos/testimonials-stories"
        element={<TestimonialsStoriesDemoPage />}
      />
    </Routes>
  )
}

