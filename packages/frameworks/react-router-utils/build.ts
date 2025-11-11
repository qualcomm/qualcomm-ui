import type {BuildOptions} from "esbuild"

import {buildOrWatch, hasArg, logPlugin} from "@qualcomm-ui/esbuild"

import pkg from "./package.json"

async function main(argv: string[]) {
  const buildOpts: BuildOptions = {
    bundle: true,
    external: [
      ...Object.keys(pkg.devDependencies),
      ...Object.keys(pkg.peerDependencies),
    ],
    metafile: true,
    minify: true,
    outdir: "dist",
    platform: "node",
    sourcemap: true,
    target: "es2023",
    tsconfig: "tsconfig.lib.json",
  }

  const isWatch = hasArg(argv, "--watch")

  await Promise.all([
    buildOrWatch(
      {
        ...buildOpts,
        entryPoints: ["./src/node/index.ts"],
        format: "esm",
        logLevel: isWatch ? "error" : "warning",
        outdir: "./dist/node",
        plugins: [logPlugin({bundleSizeOptions: {logMode: "both"}})],
      },
      isWatch,
    ),
    buildOrWatch(
      {
        ...buildOpts,
        entryPoints: ["./src/client/index.ts"],
        format: "esm",
        logLevel: isWatch ? "error" : "warning",
        outdir: "./dist/client",
        platform: "node",
        plugins: [logPlugin({bundleSizeOptions: {logMode: "both"}})],
      },
      isWatch,
    ),
  ])
}

main(process.argv)
