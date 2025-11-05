import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { scan } from 'react-scan' // must be imported before React and React DOM

import { ThemeProvider } from '@/context/theme-context'

import App, { queryClient } from './app'

// Enable react-scan for automatic component scanning
scan({
  enabled: true,
})

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
