import {writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import {hostColorTokens, tokens} from "@qualcomm-ui/vscode-core/tokens"

const outputPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/vscode.css",
)

const utilities = tokens.flatMap(({name, type}) => {
  if (type === "typography") {
    const role = name.slice("font-static-".length).replace(/-default$/, "")
    return [`@utility font-${role} {font: var(--${name});}`]
  }
  if (type === "opacity") {
    return [`@utility ${name} {opacity: var(--${name});}`]
  }
  if (type === "color") {
    return [`@utility text-${name.slice(11)} {color: var(--${name});}`]
  }
  if (type === "shadow") {
    return [`@utility ${name} {box-shadow: var(--${name});}`]
  }
  return []
})

await writeFile(
  outputPath,
  [
    "/** Generated from @qualcomm-ui/vscode-core/tokens. Do not edit directly. */",
    '@import "@qualcomm-ui/vscode-core/styles/tokens.css";',
    "@theme inline {",
    "  --font-sans: var(--type-font-family-primary);",
    "  --font-mono: var(--vscode-editor-font-family, ui-monospace, monospace);",
    ...["xs", "sm", "md"].flatMap((size) => {
      const utilitySize = size === "md" ? "base" : size
      return [
        `  --text-${utilitySize}: var(--type-font-size-${size});`,
        `  --text-${utilitySize}--line-height: normal;`,
      ]
    }),
    ...hostColorTokens.map(
      ({name, variable}) => `  --color-${name}: var(${variable});`,
    ),
    "}",
    ...utilities,
    "",
  ].join("\n"),
)
