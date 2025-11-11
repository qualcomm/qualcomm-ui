import type {BuildOptions} from "esbuild"

import {
  buildEntryPoints,
  type BuildEntryPointsOptions,
  collectFolders,
  hasArg,
  logPlugin,
} from "@qualcomm-ui/esbuild"

async function collectEntryPoints() {
  return (await collectFolders("./src")).reduce(
    (acc: Record<string, string>, name) => {
      acc[`${name}/index`] = `./src/${name}/index.ts`
      return acc
    },
    {},
  )
}

async function build(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")

  const buildOpts: BuildOptions = {
    bundle: true,
    external: ["@qualcomm-ui/utils/*", "@qualcomm-ui/dom/*", "@floating-ui/dom"],
    metafile: true,
    minify: true,
    outdir: "dist",
    platform: "browser",
    sourcemap: true,
    target: "es2023",
    tsconfig: "tsconfig.lib.json",
  }

  const entryPointOptions: BuildEntryPointsOptions = {
    collectEntryPoints,
    entryPointPattern: "index.ts",
    watchGlob: IS_WATCH ? ["./src"] : undefined,
  }

  await Promise.all([
    buildEntryPoints(
      {
        ...buildOpts,
        format: "cjs",
        logLevel: "silent",
        outExtension: {".js": ".cjs"},
      },
      entryPointOptions,
    ),
    buildEntryPoints(
      {
        ...buildOpts,
        format: "esm",
        logLevel: IS_WATCH ? "error" : "warning",
        plugins: [logPlugin({bundleSizeOptions: {logMode: "both"}})],
      },
      entryPointOptions,
    ),
  ])
}

build(process.argv)
