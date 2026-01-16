import { useState } from 'react'
import { Layout } from './components/layout/Layout'
import { SEOHead } from './components/ui/SEOHead'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import SmoothScroll from './components/layout/SmoothScroll'
import CustomCursor from './components/ui/CustomCursor'
import LoadingScreen from './components/ui/LoadingScreen'

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ErrorBoundary>
      <SEOHead />
      
      {isLoading && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      
      <CustomCursor />
      <SmoothScroll>
        <Layout />
      </SmoothScroll>
    </ErrorBoundary>
  )
}

export default App
