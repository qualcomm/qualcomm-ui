import type {BuildOptions} from "esbuild"

import {buildOrWatch, getArg, hasArg} from "@qualcomm-ui/esbuild"

import pkg from "./package.json"

async function main(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")
  const BUILD_MODE = getArg(argv, "--mode") || "production"

  const buildOpts: BuildOptions = {
    bundle: true,
    define: {
      "process.env.BUILD_MODE": JSON.stringify(BUILD_MODE),
    },
    external: [...Object.keys(pkg.devDependencies)],
    loader: {
      ".node": "copy",
    },
    logLevel: "error",
    platform: "node",
    sourcemap: true,
    target: "es2020",
    tsconfig: "tsconfig.lib.json",
  }

  await Promise.all([
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
