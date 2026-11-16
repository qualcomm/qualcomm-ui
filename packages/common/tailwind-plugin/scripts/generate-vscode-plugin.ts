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
    return [
      `@utility font-vscode-${name.slice(5)} {font: var(--qui-vscode-${name});}`,
    ]
  }
  if (type === "opacity") {
    return [
      `@utility opacity-vscode-${name.slice(8)} {opacity: var(--qui-vscode-${name});}`,
    ]
  }
  if (type === "color") {
    return [
      `@utility text-vscode-${name.slice(11)} {color: var(--qui-vscode-${name});}`,
    ]
  }
  if (
    type === "font-size" &&
    ["font-size-xs", "font-size-sm", "font-size-md"].includes(name)
  ) {
    return [
      `@utility text-vscode-${name.slice(10)} {font-size: var(--qui-vscode-${name}); line-height: normal;}`,
    ]
  }
  return []
})

await writeFile(
  outputPath,
  [
    "/** Generated from @qualcomm-ui/vscode-core/tokens. Do not edit directly. */",
    '@import "@qualcomm-ui/vscode-core/styles/tokens.css";',
    "@theme inline {",
    ...hostColorTokens.map(
      ({name, variable}) => `  --color-vscode-${name}: var(${variable});`,
    ),
    ...tokens
      .filter(({type}) => type === "shadow")
      .map(
        ({name}) =>
          `  --shadow-vscode-${name.slice(7)}: var(--qui-vscode-${name});`,
      ),
    "}",
    ...utilities,
    "",
  ].join("\n"),
)
