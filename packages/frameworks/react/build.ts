import * as babel from "@babel/core"
import BabelPluginReactCompiler from "babel-plugin-react-compiler"
import type {BuildOptions, Plugin} from "esbuild"
import {readFileSync} from "node:fs"
import {writeFile} from "node:fs/promises"
import QuickLRU from "quick-lru"

import {
  buildEntryPoints,
  type BuildEntryPointsOptions,
  collectFolders,
  getArg,
  hasArg,
  logPlugin,
} from "@qualcomm-ui/esbuild"

import pkg from "./package.json"

export function reactCompilerEsbuildPlugin({
  filter,
  runtimeModulePath,
  sourceMaps,
}: {
  filter: RegExp
  runtimeModulePath: string
  sourceMaps: boolean
}): Plugin {
  return {
    name: "esbuild-react-compiler-plugin",
    setup(build) {
      // Cache previous outputs for incremental rebuilds
      const buildCache = new QuickLRU<string, string>({maxSize: 1000})

      let timings: number[] = []

      build.onEnd(() => {
        if (timings.length < 1) {
          return
        }

        const totalTime = timings.reduce((sum, x) => sum + x, 0).toFixed(0)
        console.log(`[React Compiler] ${timings.length} files changed`)
        console.log(`[React Compiler] Used ${totalTime} ms`)

        timings = []
      })

      build.onLoad({filter, namespace: ""}, (args) => {
        const contents = readFileSync(args.path, "utf8")

        const t0 = performance.now()

        if (buildCache.has(contents)) {
          return {
            contents: buildCache.get(contents),
            loader: "js",
          }
        }

        const output = build.esbuild.transformSync(contents, {
          define: build.initialOptions.define,
          jsx: "automatic",
          loader: "tsx",
          target: build.initialOptions.target,
        })

        const transformResult = babel.transformSync(output.code, {
          caller: {
            name: "esbuild-react-compiler-plugin",
            supportsStaticESM: true,
          },
          filename: args.path,
          plugins: [
            // Warning: using string config here (ie 'babel-plugin-react-compiler')
            // instead of the directly imported object is much slower than directly
            // passing the plugin object because Babel has to resolve the plugin file
            // from node_modules
            [
              BabelPluginReactCompiler,
              {
                runtimeModule: runtimeModulePath,
              },
            ],
          ],
          // TODO: figure out sourcemap setting and chaining
          sourceMaps,
        })

        timings.push(performance.now() - t0)

        if (transformResult?.code) {
          buildCache.set(contents, transformResult?.code)
        }

        return {
          contents: transformResult?.code ?? undefined,
          loader: "js",
        }
      })
    },
  }
}

async function collectEntryPoints() {
  // Create an object with output names as keys and entry points as values
  return (await collectFolders("./src")).reduce(
    (acc: Record<string, string>, name) => {
      acc[`${name}/index`] = `./src/${name}/index.ts`
      return acc
    },
    {},
  )
}

async function build(argv: string[]) {
  const isDev = getArg(argv, "--mode") === "development"
  const buildOpts: BuildOptions = {
    bundle: true,
    external: [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
      "@tanstack/virtual-core",
      "@qualcomm-ui/core",
      "@qualcomm-ui/core/*",
      "@qualcomm-ui/dom/*",
      "@qualcomm-ui/qds-core/*",
      "@qualcomm-ui/react/*",
      "@qualcomm-ui/react-core/*",
      "@qualcomm-ui/utils/*",
    ],
    metafile: true,
    minifyIdentifiers: !isDev,
    minifySyntax: true,
    minifyWhitespace: true,
    outdir: "dist",
    platform: "node",
    sourcemap: true,
    target: "es2023",
    tsconfig: "tsconfig.lib.json",
  }

  const watch = hasArg(argv, "--watch")

  const opts: BuildEntryPointsOptions = {
    collectEntryPoints,
    entryPointPattern: "index.ts",
    watchGlob: watch ? ["./src"] : undefined,
  }

  await buildEntryPoints(
    {
      ...buildOpts,
      format: "esm",
      logLevel: watch ? "error" : "warning",
      plugins: [
        logPlugin({bundleSizeOptions: {logMode: "both"}}),
        reactCompilerEsbuildPlugin({
          filter: /src\/.*.tsx?/,
          runtimeModulePath: "react-compiler-runtime",
          sourceMaps: true,
        }),
      ],
    },
    opts,
  ).then(async (res) => {
    if (res) {
      await writeFile(
        "./build-metafile.json",
        JSON.stringify(res.metafile),
        "utf-8",
      )
    }
  })
}

build(process.argv)
