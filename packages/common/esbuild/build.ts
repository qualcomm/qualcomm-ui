import type {BuildOptions} from "esbuild"

import {buildOrWatch, hasArg, logPlugin} from "./src"

async function main(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")

  const buildOpts: BuildOptions = {
    bundle: true,
    external: ["esbuild", "typescript"],
    metafile: true,
    platform: "node",
    sourcemap: true,
    target: "es2023",
    tsconfig: "tsconfig.lib.json",
  }

  await Promise.all([
    buildOrWatch(
      {
        ...buildOpts,
        entryPoints: ["src/index.ts"],
        format: "esm",
        logLevel: IS_WATCH ? "error" : "warning",
        outfile: "dist/index.js",
      },
      IS_WATCH,
    ),
    buildOrWatch(
      {
        ...buildOpts,
        entryPoints: ["src/cli.ts"],
        format: "cjs",
        logLevel: IS_WATCH ? "error" : "warning",
        outfile: "dist/cli.cjs",
        plugins: [logPlugin({bundleSizeOptions: {logMode: "aggregate"}})],
      },
      IS_WATCH,
    ),
  ])
}

main(process.argv)
