import * as babel from "@babel/core"
import BabelPluginReactCompiler from "babel-plugin-react-compiler"
import type {BuildOptions, Plugin} from "esbuild"
import {existsSync, readFileSync} from "node:fs"
import {resolve} from "node:path"
import QuickLRU from "quick-lru"

import {
  buildEntryPoints,
  type BuildEntryPointsOptions,
  collectFolders,
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
        const contents = readFileSync(args.path, "utf-8")

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

async function collectEntryPoints(): Promise<Record<string, string>> {
  return (await collectFolders("./src"))
    .filter((name) => {
      const directory = resolve(`./src/${name}`)
      try {
        return existsSync(resolve(directory, "index.ts"))
      } catch {
        return false
      }
    })
    .reduce((acc: Record<string, string>, name) => {
      acc[`${name}/index`] = `./src/${name}/index.ts`
      return acc
    }, {})
}

async function build(argv: string[]) {
  const buildOpts: BuildOptions = {
    banner: {
      js: `"use client";`,
    },
    bundle: true,
    external: [
      ...Object.keys(pkg.devDependencies ?? {}),
      "@qualcomm-ui/core/*",
      "@qualcomm-ui/react-core/*",
      "@qualcomm-ui/react-router-utils/*",
      "@qualcomm-ui/utils/*",
    ],
    metafile: true,
    minify: true,
    minifyIdentifiers: false,
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

  await Promise.all([
    buildEntryPoints(
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
    ),
  ])
}

build(process.argv)
