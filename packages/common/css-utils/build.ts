import type {BuildOptions} from "esbuild"

import {buildOrWatch, getArg, hasArg} from "@qualcomm-ui/esbuild"

async function main(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")
  const BUILD_MODE = getArg(argv, "--mode") || "production"

  const buildOpts: BuildOptions = {
    bundle: true,
    define: {
      "process.env.BUILD_MODE": JSON.stringify(BUILD_MODE),
    },
    external: ["typescript", "prettier", "esbuild", "typedoc"],
    loader: {
      ".node": "copy",
    },
    logLevel: "error",
    platform: "node",
    sourcemap: true,
    target: "es2020",
    tsconfig: "tsconfig.lib.json",
  }

  // Build main and preload
  await Promise.all([
    buildOrWatch(
      {
        ...buildOpts,
        banner: {js: "#!/usr/bin/env node"},
        entryPoints: ["./src/cli/cli.ts"],
        external: ["typescript", "@commander-js/extra-typings", "cosmiconfig"],
        format: "cjs",
        logLevel: "error",
        metafile: true,
        outfile: "./dist/cli.cjs",
      },
      IS_WATCH,
    ),
    buildOrWatch(
      {
        ...buildOpts,
        entryPoints: ["./src/index.ts"],
        format: "cjs",
        outfile: "./dist/index.cjs",
      },
      IS_WATCH,
    ),
    buildOrWatch(
      {
        ...buildOpts,
        entryPoints: ["./src/index.ts"],
        format: "esm",
        outfile: "./dist/index.js",
      },
      IS_WATCH,
    ),
  ])
}

main(process.argv)
