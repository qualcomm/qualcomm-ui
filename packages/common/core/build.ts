import type {BuildOptions} from "esbuild"
import {writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import {
  buildEntryPoints,
  type BuildEntryPointsOptions,
  collectFolders,
  hasArg,
  logPlugin,
} from "@qualcomm-ui/esbuild"

const __dirname = dirname(fileURLToPath(import.meta.url))

import pkg from "./package.json"

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
    external: [
      "@qualcomm-ui/core/*",
      "@qualcomm-ui/utils/*",
      "@qualcomm-ui/dom/*",
      ...Object.keys(pkg.peerDependencies),
    ],
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
        plugins: [
          logPlugin({bundleSizeOptions: {logMode: "both"}}),
          {
            name: "metafile",
            setup(build) {
              build.onEnd(async (result) => {
                if (result.metafile) {
                  await writeFile(
                    resolve(__dirname, "./build-metafile.json"),
                    JSON.stringify(result.metafile),
                  )
                }
              })
            },
          },
        ],
      },
      entryPointOptions,
    ),
  ])
}

build(process.argv)
