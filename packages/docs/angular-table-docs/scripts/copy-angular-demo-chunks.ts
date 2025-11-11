#!/usr/bin/env node

import {build} from "esbuild"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

try {
  await build({
    bundle: true,
    entryPoints: [resolve(__dirname, "../dist/browser/main.js")],
    format: "esm",
    minify: true,
    outfile: resolve(__dirname, "../public/main.js"),
    sourcemap: false,
  }).catch()
} catch (error: any) {
  console.error("❌ Sync failed:", error.message)
  process.exit(1)
}
