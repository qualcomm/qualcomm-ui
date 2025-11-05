// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import type {BuildOptions} from "esbuild"

import {buildOrWatch, logPlugin} from "./build"

program.allowUnknownOption(false)

program
  .command("build")
  .summary(
    "Build default entrypoint to ESM and CJS compatible output in the dist directory",
  )
  .option("--watch", "Watch for changes", false)
  .option("--platform <output>", "Platform")
  .option("--tsconfig <tsconfig>", "tsconfig file", "tsconfig.json")
  .action(async ({platform, tsconfig, watch}) => {
    const buildOpts: BuildOptions = {
      bundle: true,
      entryPoints: ["src/index.ts"],
      platform:
        platform === "browser" || platform === "node" || platform === "neutral"
          ? platform
          : "node",
      sourcemap: true,
      target: "es2023",
      tsconfig,
    }

    await Promise.all([
      buildOrWatch(
        {
          ...buildOpts,
          // include typedoc in cli to fix issues with npm package manager
          format: "cjs",
          logLevel: "silent",
          outfile: "dist/index.cjs",
        },
        watch,
      ),
      buildOrWatch(
        {
          ...buildOpts,
          // include typedoc in cli to fix issues with npm package manager
          format: "esm",
          logLevel: watch ? "error" : "warning",
          outfile: "dist/index.js",
          plugins: [logPlugin()],
        },
        watch,
      ),
    ])
  })

program.parse(process.argv)
