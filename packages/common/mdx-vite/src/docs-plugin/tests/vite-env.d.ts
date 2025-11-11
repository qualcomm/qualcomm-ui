/// <reference types="vite/client" />
interface ImportMetaEnv {
  UPDATE_SNAPSHOTS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
