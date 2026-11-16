import {writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import {tokens} from "../src/tokens/tokens.js"

const stylesDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/styles",
)
const header =
  "/** Generated from src/tokens/tokens.ts. Do not edit directly. */\n"
const declarations = tokens
  .map(({name, value}) => `  --qui-vscode-${name}: ${value};`)
  .join("\n")
const utilities = tokens.flatMap(({name, type}) => {
  if (type === "typography") {
    return [
      `:where(.qui-vscode) .qui-vscode-${name.slice(5)} {\n  font: var(--qui-vscode-${name});\n}`,
    ]
  }
  if (type === "color") {
    return [
      `:where(.qui-vscode) .qui-vscode-${name.slice(6)} {\n  color: var(--qui-vscode-${name});\n}`,
    ]
  }
  if (
    type === "font-size" &&
    ["font-size-xs", "font-size-sm", "font-size-md"].includes(name)
  ) {
    return [
      `:where(.qui-vscode) .qui-vscode-text-${name.slice(10)} {\n  font-size: var(--qui-vscode-${name});\n  line-height: normal;\n}`,
    ]
  }
  return []
})

await writeFile(
  resolve(stylesDirectory, "tokens.css"),
  `${header}:where(.qui-vscode) {\n${declarations}\n}\n`,
)
await writeFile(
  resolve(stylesDirectory, "typography.css"),
  `${header}\n${utilities.join("\n\n")}\n`,
)
