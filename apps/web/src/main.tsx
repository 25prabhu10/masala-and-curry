import { i18n } from '@lingui/core'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'
import { I18nProvider } from '@lingui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { loadTranslations } from '@/lib/i18nt'
import queryClient from '@/lib/query-client'
import App from './app'

await loadTranslations('en-US')

const rootElement = document.getElementById('root')

if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <I18nProvider i18n={i18n}>
          <App />
        </I18nProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
