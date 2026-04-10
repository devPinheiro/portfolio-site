import type { ReactNode } from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'

export function DemoPageShell({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <>
      <Header />
      <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen w-full relative transition-colors duration-300 pt-24 md:pt-28">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {title}
            </h1>
            {description ? (
              <p className="mt-3 text-sm md:text-base text-black/70 dark:text-white/70 max-w-2xl">
                {description}
              </p>
            ) : null}
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}

