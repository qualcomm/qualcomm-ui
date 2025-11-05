// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import chokidar, {type FSWatcher} from "chokidar"
import {glob} from "glob"
import {parse} from "node:path"
import ora from "ora"

import {CssBuilder, getDefaultWatchOptions} from "./build-css"
import type {CssBuilderConfig} from "./css-utils.types"

function debounce(
  func: (...args: any[]) => void | Promise<void>,
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

export async function watchCss(opts: CssBuilderConfig) {
  const watchOptions = getDefaultWatchOptions(opts)
  const builder = new CssBuilder({...opts, isWatch: true})
  let fileWatcher: FSWatcher | null = null
  let directoryWatcher: FSWatcher | null = null

  // Debounced build function to prevent multiple rapid builds
  const debouncedBuild = debounce(async () => {
    try {
      await builder.build()
    } catch (e: any) {
      ora().fail(`Error compiling: ${e.message}`)
    }
  }, 100)

  // Initial build if requested
  if (watchOptions.buildOnInit) {
    await builder.build()
  }

  // Function to set up file watchers based on current glob patterns
  async function setupWatchers() {
    // Close existing watcher if it exists
    if (fileWatcher) {
      await fileWatcher.close()
      fileWatcher = null
    }

    // For each file group, resolve globs and watch the files
    for (const group of opts.fileGroups) {
      const files = await glob(group.cssFiles, {ignore: group.ignore})

      if (files.length === 0) {
        console.warn(`No files found matching pattern: ${group.cssFiles}`)
        continue
      }

      fileWatcher = chokidar.watch(files, {
        ignoreInitial: true,
        persistent: true,
      })

      fileWatcher.on("change", (changedFile) => {
        const file = parse(changedFile)
        console.debug(
          `\nChanged ${chalk.blueBright(`${file.name}${file.ext}`)}, compiling...`,
        )
        debouncedBuild()
      })

      fileWatcher.on("add", (addedFile) => {
        const file = parse(addedFile)
        console.debug(
          `\nNew file detected: ${chalk.blueBright(`${file.name}${file.ext}`)}, compiling...`,
        )
        debouncedBuild()
      })

      fileWatcher.on("unlink", (removedFile) => {
        const file = parse(removedFile)
        console.debug(
          `\nFile removed: ${chalk.blueBright(`${file.name}${file.ext}`)}, compiling...`,
        )
        debouncedBuild()
      })
    }
  }

  // Watch the source directory for structural changes
  directoryWatcher = chokidar.watch(opts.watchOptions?.include || "./", {
    ignored: opts.watchOptions?.exclude,
    ignoreInitial: true,
    persistent: true,
    ...opts.watchOptions?.chokidarWatchOptions,
  })

  async function updateWatchers(file: string) {
    if (
      file.endsWith(".scss") ||
      file.endsWith(".css") ||
      file.endsWith(".less")
    ) {
      return setupWatchers()
    }
  }

  // When the directory structure changes, rebuild the file watchers
  directoryWatcher.on("add", (file) => {
    void updateWatchers(file)
  })
  directoryWatcher.on("unlink", (file) => {
    void updateWatchers(file)
  })

  // Initial setup of watchers
  await setupWatchers()

  // Return a function to close all watchers
  return async () => {
    if (fileWatcher) {
      await fileWatcher.close()
    }
    if (directoryWatcher) {
      await directoryWatcher.close()
    }
  }
}
