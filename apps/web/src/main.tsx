import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'

import { QueryClientProvider } from '@tanstack/react-query'

import { ThemeProvider } from '@/context/theme-context'

import App, { queryClient } from './app'

const rootElement = document.getElementById('root')

if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
