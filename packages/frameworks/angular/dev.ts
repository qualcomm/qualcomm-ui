/**
 * Watches the angular-core dist directory and starts the build process
 * once the output has been stable for 2 seconds.
 */

import {execSync} from "node:child_process"
import {access, readdir} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {setTimeout as setTimeoutPromise} from "node:timers/promises"
import {fileURLToPath} from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const ANGULAR_CORE_DIST_DIR = resolve(__dirname, "../angular-core/dist")
const ANGULAR_CORE_SRC_DIR = resolve(__dirname, "../angular-core/src")

// give the current angular-core dist dir time to clear its contents
await setTimeoutPromise(2000)

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

  return entrypoints.map((name) => ({
    fileName: name,
    path: resolve(ANGULAR_CORE_DIST_DIR, name),
  }))
}

/**
 * Ensures that every entrypoint in the angular-core src directory has been built.
 */
async function validateAngularCore() {
  const entrypoints = await scanForEntrypoints()

  const builtEntrypoints = await Promise.all(
    entrypoints.map((entrypoint) => {
      const path = resolve(
        entrypoint.path,
        `../types/qualcomm-ui-angular-core-${entrypoint.fileName}.d.ts`,
      )
      return access(path)
        .then(() => true)
        .catch(() => null)
    }),
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

  if (!angularCoreBuilt) {
    throw new Error("Failed to build @qualcomm-ui/angular-core")
  }
}

await waitForAngularCore()
