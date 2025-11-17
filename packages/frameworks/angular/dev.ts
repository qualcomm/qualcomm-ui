/**
 * Watches the angular-core dist directory and starts the build process
 * once the output has been stable for 2 seconds.
 */

import chokidar from "chokidar"
import {execSync} from "node:child_process"
import {access, readdir} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {setTimeout as setTimeoutPromise} from "node:timers/promises"
import {fileURLToPath} from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const DEBOUNCE_MS = 2000
const ANGULAR_CORE_DIST_DIR = resolve(__dirname, "../angular-core/dist")
const ANGULAR_CORE_SRC_DIR = resolve(__dirname, "../angular-core/src")

let timeoutId: ReturnType<typeof setTimeout> | null = null

// give the current angular-core dist dir time to clear its contents
await setTimeoutPromise(500)

async function scanForEntrypoints() {
  const files = await readdir(ANGULAR_CORE_SRC_DIR, {withFileTypes: true})

  const entrypoints = (
    await Promise.all(
      files
        .filter((file) => file.isDirectory())
        .map(async (file) => {
          const path = resolve(
            ANGULAR_CORE_SRC_DIR,
            file.name,
            "ng-package.json",
          )
          return access(path)
            .then(() => file.name)
            .catch(() => null)
        }),
    )
  ).filter((name): name is string => name !== null)

  return entrypoints.map((name) => resolve(ANGULAR_CORE_DIST_DIR, name))
}

/**
 * Ensures that every entrypoint in the angular-core src directory has been built.
 */
async function validateAngularCore() {
  const entrypoints = await scanForEntrypoints()

  const builtEntrypoints = await Promise.all(
    entrypoints.map((entrypoint) =>
      access(resolve(entrypoint, "index.d.ts"))
        .then(() => true)
        .catch(() => null),
    ),
  )

  return builtEntrypoints.every(Boolean)
}

async function waitForAngularCore() {
  console.debug("Waiting for angular-core")
  let i = 0
  let angularCoreBuilt = false

  while (i < 60 && !angularCoreBuilt) {
    i++

    angularCoreBuilt = await validateAngularCore()
    if (angularCoreBuilt) {
      console.debug(
        "@qualcomm-ui/angular-core built, starting watcher for @qualcomm-ui/angular",
      )
      execSync("pnpm build --watch", {stdio: "inherit"})
    } else {
      await setTimeoutPromise(1000)
    }
  }
}

await waitForAngularCore()

// TODO: enhance with restart whenever a new entrypoint is added
function _startWatcher() {
  /**
   * Closes the watcher and starts the build process in watch mode.
   */
  function startProcess() {
    console.debug("@qualcomm-ui/angular-core output stable, starting build")
    watcher.close()
    execSync("pnpm build --watch", {stdio: "inherit"})
  }

  const watcher = chokidar.watch(ANGULAR_CORE_DIST_DIR, {
    awaitWriteFinish: {
      pollInterval: 100,
      stabilityThreshold: 1000,
    },
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
}
