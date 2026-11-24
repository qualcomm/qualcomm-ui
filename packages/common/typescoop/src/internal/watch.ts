// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chokidar from "chokidar"

import {TypeParser} from "../type-parser.js"

import {build} from "./build.js"
import {resolveConfigSync, resolveTsconfig} from "./config.js"

export async function watch(configPath: string): Promise<void> {
  const typeParser = new TypeParser(resolveConfigSync(configPath))
  const parsedConfig = resolveTsconfig(typeParser.options.tsconfig)

  let glob = typeParser.options.entryPoints ?? []
  if (!glob.length && parsedConfig) {
    glob = Object.entries(parsedConfig.wildcardDirectories ?? {})
      .filter(([, value]) => !!value)
      .map(([key]) => key)
  }
  if (!glob.length && parsedConfig) {
    glob = parsedConfig.fileNames
  }

  if (!glob.length) {
    console.debug("No files found, exiting watcher")
    return
  }

  let building = false
  let shouldBuild = false

  let timeoutRef: ReturnType<typeof setTimeout> | undefined = undefined

  /**
   * Executes the build process with debouncing and queueing
   * to prevent overlapping builds
   */
  async function doBuild(): Promise<boolean> {
    // If already building, queue another build and exit
    if (building) {
      shouldBuild = true
      return false
    }

    try {
      // Mark as building and reset queue flag
      building = true
      shouldBuild = false

      // add newline
      console.debug("")
      await build(typeParser)
    } catch (error) {
      console.error("Extraction failed:", error)
      return false
    } finally {
      building = false
    }

    // A change arrived during the build, so build again with the latest files.
    if (shouldBuild) {
      return doBuild()
    }
    return true
  }

  await build(typeParser)

  console.debug("")
  console.debug("Extraction complete. Watching for file changes.")

  // Watch for file changes with debouncing
  chokidar
    .watch(glob, {
      awaitWriteFinish: {
        pollInterval: 100,
        stabilityThreshold: 100,
      },
    })
    .on("change", () => {
      // Clear previous timeout to debounce rapid changes
      clearTimeout(timeoutRef)
      // Schedule a new build after a short delay
      timeoutRef = setTimeout(() => {
        doBuild()
          .then(() => {
            console.debug("")
            console.debug("Extraction complete. Watching for file changes.")
          })
          .catch((error) => {
            console.debug("Unexpected error during build:", error)
          })
      }, 100)
    })
}
