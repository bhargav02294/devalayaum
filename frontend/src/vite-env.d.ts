/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // add other env variables here if needed later
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
