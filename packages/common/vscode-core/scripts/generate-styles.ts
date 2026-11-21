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
  .map(({name, value}) => `  --${name}: ${value};`)
  .join("\n")
await writeFile(
  resolve(stylesDirectory, "tokens.css"),
  `${header}:where(.qui-vscode) {\n${declarations}\n}\n`,
)
