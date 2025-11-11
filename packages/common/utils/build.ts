import type {BuildOptions} from "esbuild"
import {glob} from "glob"

import {
  buildEntryPoints,
  type BuildEntryPointsOptions,
  hasArg,
  logPlugin,
} from "@qualcomm-ui/esbuild"

async function collectEntryPoints() {
  return glob(["./src/*.ts", "./src/*/index.ts"], {
    ignore: ["**/*.spec.ts", "./src/index.ts"],
  })
}

async function main(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")

  const buildOpts: BuildOptions = {
    bundle: true,
    external: ["@qualcomm-ui/utils/*"],
    metafile: true,
    minify: true,
    platform: "browser",
    sourcemap: true,
    target: "es2023",
    tsconfig: "tsconfig.lib.json",
  }

  const entryPointOptions: BuildEntryPointsOptions = {
    collectEntryPoints,
    entryPointPattern: ".ts",
    watchGlob: IS_WATCH ? ["./src"] : undefined,
  }

  await Promise.all([
    buildEntryPoints(
      {
        ...buildOpts,
        format: "cjs",
        logLevel: "silent",
        outdir: "dist",
        outExtension: {".js": ".cjs"},
      },
      entryPointOptions,
    ),
    buildEntryPoints(
      {
        ...buildOpts,
        format: "esm",
        logLevel: IS_WATCH ? "error" : "warning",
        outdir: "dist",
        plugins: [logPlugin({bundleSizeOptions: {logMode: "both"}})],
      },
      entryPointOptions,
    ),
  ])
}

main(process.argv)
