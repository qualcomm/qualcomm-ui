// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {watch} from "chokidar"
import esbuild, {
  build,
  type BuildContext,
  type BuildOptions,
  type BuildResult,
} from "esbuild"

// Keep track of active build contexts to stop them when needed
let activeContexts: BuildContext[] = []

async function stopWatching() {
  return Promise.all(
    activeContexts.map((context) => context.dispose()),
  ).finally(() => {
    activeContexts = []
  })
}

async function watchEntryPoints(
  buildOptions: Omit<BuildOptions, "entryPoints">,
  {
    collectEntryPoints,
    entryPointPattern,
    watchGlob,
  }: Required<BuildEntryPointsOptions>,
): Promise<void> {
  async function rebuild(file: string): Promise<void> {
    // Only trigger rebuild on index.ts file creation or removal
    const isNewIndexFile =
      file.endsWith(entryPointPattern) && !file.includes("node_modules")

    if (isNewIndexFile) {
      if (buildOptions.logLevel !== "silent") {
        console.log("Added or removed entry point, restarting watch process...")
      }

      // Stop current build processes
      await stopWatching()

      // Recollect entry points and rebuild
      const entryPoints = await collectEntryPoints()
      const context = await esbuild.context({...buildOptions, entryPoints})
      activeContexts.push(context)
      await context.watch()
    }
  }

  const debouncedRebuild = debounce(rebuild, 100)

  const watcher = watch(watchGlob)

  watcher.on("add", debouncedRebuild)
  watcher.on("unlink", debouncedRebuild)

  // start the watcher
  const entryPoints = await collectEntryPoints()
  const context = await esbuild.context({...buildOptions, entryPoints})
  context.watch()
  activeContexts.push(context)

  // Clean up watcher on process exit
  process.on("SIGINT", () => {
    watcher.close()
    process.exit(0)
  })
}

export interface BuildEntryPointsOptions {
  collectEntryPoints: () => Promise<BuildOptions["entryPoints"]>
  /**
   * The file pattern for this package's entrypoints.
   *
   * @default "index.ts"
   */
  entryPointPattern?: string
  watchGlob?: string[]
}

/**
 * A build/watch function. If watchGlob is provided, it will watch for changes. This
 * is an enhancement of esbuild's watch mode that watches for changes to entryPoint
 * files. If an entryPoint changes, the build process restarts to account for the
 * updated entryPoint.
 */
export async function buildEntryPoints(
  buildOptions: Omit<BuildOptions, "entryPoints">,
  {
    collectEntryPoints,
    entryPointPattern = "index.ts",
    watchGlob,
  }: BuildEntryPointsOptions,
): Promise<BuildResult | void> {
  if (watchGlob) {
    return watchEntryPoints(buildOptions, {
      collectEntryPoints,
      entryPointPattern,
      watchGlob,
    })
  }
  const entryPoints = await collectEntryPoints()
  return build({...buildOptions, entryPoints})
}

function debounce(
  func: (...args: any[]) => void,
  wait = 166,
): {(...args: any[]): void; clear(): void} {
  let timeout: ReturnType<typeof setTimeout>
  function debounced(...args: any[]): void {
    const later = () => {
      // @ts-ignore
      func.apply(this, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }

  debounced.clear = () => {
    clearTimeout(timeout)
  }

  return debounced
}
