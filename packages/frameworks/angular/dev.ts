/**
 * Watches the angular-core dist directory and starts the build process
 * once the output has been stable for 2 seconds.
 */

import chokidar from "chokidar"
import {execSync} from "node:child_process"
import {dirname, resolve} from "node:path"
import {setTimeout as setTimeoutPromise} from "node:timers/promises"
import {fileURLToPath} from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const DEBOUNCE_MS = 2000
let timeoutId: NodeJS.Timeout | null = null

/**
 * Closes the watcher and starts the build process in watch mode.
 */
function startProcess() {
  console.debug("@qualcomm-ui/angular-core output stable, starting build")
  watcher.close()
  execSync("pnpm build --watch", {stdio: "inherit"})
}

await setTimeoutPromise(DEBOUNCE_MS)

const watcher = chokidar.watch("dist", {
  awaitWriteFinish: {
    pollInterval: 100,
    stabilityThreshold: 1000,
  },
  cwd: resolve(__dirname, "../angular-core"),
  persistent: true,
})

watcher.on("all", () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    startProcess()
    timeoutId = null
  }, DEBOUNCE_MS)
})

watcher.on("error", (error) => {
  console.error("Watcher error:", error)
})

console.log("Watching for changes...")
