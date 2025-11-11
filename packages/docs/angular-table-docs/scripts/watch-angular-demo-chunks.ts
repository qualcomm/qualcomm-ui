import chokidar from "chokidar"
import {build} from "esbuild"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
let timeout: ReturnType<typeof setTimeout> | undefined = undefined

function main() {
  chokidar
    .watch("dist/browser", {
      awaitWriteFinish: {
        pollInterval: 100,
        stabilityThreshold: 1000,
      },
      cwd: resolve(__dirname, "../"),
      usePolling: true,
    })
    .on("all", (event, file) => {
      if ((event !== "add" && event !== "change") || !file.endsWith(".js")) {
        return
      }

      clearTimeout(timeout)

      timeout = setTimeout(() => {
        void build({
          bundle: true,
          entryPoints: [resolve(__dirname, "../dist/browser/main.js")],
          format: "esm",
          minify: true,
          outfile: resolve(__dirname, "../public/main.js"),
          sourcemap: true,
        }).catch()
      }, 100)
    })
}

main()
