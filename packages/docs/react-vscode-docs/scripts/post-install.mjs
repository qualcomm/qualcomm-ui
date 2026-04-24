import {existsSync, mkdirSync, writeFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = dirname(__filename) // get the name of the directory

const typedocPath = resolve(__dirname, "../.typedoc")
const docPropsPath = resolve(__dirname, "../.typedoc/doc-props.json")

if (!existsSync(typedocPath)) {
  mkdirSync(typedocPath)
}

if (!existsSync(docPropsPath)) {
  writeFileSync(docPropsPath, JSON.stringify({props: {}}), "utf-8")
}
