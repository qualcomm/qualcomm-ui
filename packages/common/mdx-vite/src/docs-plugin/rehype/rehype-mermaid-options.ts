import {dirname} from "node:path"
import {fileURLToPath} from "node:url"
import type {RehypeMermaidOptions} from "rehype-mermaid"
import type {Pluggable} from "unified"

import {mermaidStyles} from "./mermaid-styles"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const rehypeMermaidOptions: RehypeMermaidOptions = {
  mermaidConfig: {
    altFontFamily: "Fira Mono",
    fontFamily: "sans-serif",
    fontSize: 14,
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
