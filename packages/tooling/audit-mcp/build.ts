import type {BuildOptions} from "esbuild"

import {
  buildEntryPoints,
  type BuildEntryPointsOptions,
  collectFolders,
  hasArg,
  logPlugin,
} from "@qualcomm-ui/esbuild"

import pkg from "./package.json"

async function build(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")

  const sharedOpts: BuildOptions = {
    bundle: true,
    external: [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
      "node:*",
    ],
    format: "esm",
    metafile: true,
    outdir: "./dist",
    platform: "node",
    plugins: [logPlugin({bundleSizeOptions: {logMode: "all"}})],
    sourcemap: true,
    target: "es2022",
    tsconfig: "tsconfig.lib.json",
  }

  const opts: BuildEntryPointsOptions = {
    collectEntryPoints: async () => {
      return (await collectFolders("./src")).reduce(
        (acc: Record<string, string>, name) => {
          acc[`${name}/index`] = `./src/${name}/index.ts`
          return acc
        },
        {},
      )
    },
    entryPointPattern: "index.ts",
    watchGlob: IS_WATCH ? ["./src"] : undefined,
  }

  console.log("[build.ts] building...")
  await buildEntryPoints(sharedOpts, opts)
  console.log("[build.ts] done")
}

build(process.argv)
