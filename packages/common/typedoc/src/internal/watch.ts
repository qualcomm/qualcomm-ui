// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chokidar from "chokidar"

import {TypeParser} from "../type-parser"

import {build} from "./build"
import {resolveConfigSync, resolveTsconfig} from "./config"

export async function watch(configPath: string) {
  const config = resolveConfigSync(configPath)
  const typeParser = new TypeParser(config)
  const tsconfigPath = typeParser.options.typedocOptions?.tsconfig ?? ""
  const parsedConfig = resolveTsconfig(tsconfigPath)
  if (!parsedConfig) {
    console.debug("No tsconfig found, exiting watcher")
    return
  }

  let glob = Object.entries(parsedConfig.wildcardDirectories ?? {})
    .filter(([, value]) => !!value)
    .map(([key]) => key)

  if (!glob.length) {
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
      await build(config)

      // Check if another build was requested during this build
      if (shouldBuild) {
        return doBuild()
      }

      return true
    } catch (error) {
      console.error("Build failed:", error)
      return false
    } finally {
      // Always reset building flag, even if an error occurred
      building = false
    }
  }

  await build(config)
  console.debug("")
  console.debug("Build complete. Watching for file changes.")

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
            console.debug("Build complete. Watching for file changes.")
          })
          .catch((error) => {
            console.debug("Unexpected error during build:", error)
          })
      }, 100)
    })
}
