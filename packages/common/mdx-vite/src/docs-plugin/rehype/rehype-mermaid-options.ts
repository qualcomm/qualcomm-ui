import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import type {RehypeMermaidOptions} from "rehype-mermaid"
import type {Pluggable} from "unified"

import {mermaidStyles} from "./mermaid-styles"

const __dirname = dirname(fileURLToPath(import.meta.url))

function getCssFile() {
  return resolve(__dirname, "./mermaid.css")
}

export const rehypeMermaidOptions: RehypeMermaidOptions = {
  css: getCssFile(),
  mermaidConfig: {
    fontFamily: "var(--type-font-family-secondary)",
    fontSize: 8,
    themeCSS: mermaidStyles,
  },
}

export async function tryImportRehypeMermaid(): Promise<Pluggable> {
  try {
    const rehypeMermaid = await import("rehype-mermaid").then(
      (res) => res.default,
    )
    return [rehypeMermaid, rehypeMermaidOptions] as Pluggable
  } catch {
    return {}
  }
}
