/// <reference types="vite/client" />

// oxlint-disable-next-line no-empty-object-type
interface ViteTypeOptions {}

interface ImportMetaEnv {
  readonly VITE_APP_URL: string
  readonly VITE_BASE_PATH: string
  readonly VITE_AUTH_BASE_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
