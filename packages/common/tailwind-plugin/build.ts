import type {BuildOptions} from "esbuild"
import {writeFile} from "node:fs/promises"

import {buildOrWatch, hasArg, logPlugin} from "@qualcomm-ui/esbuild"

import pkg from "./package.json"

async function main(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")

  const buildOpts: BuildOptions = {
    bundle: true,
    external: [...Object.keys(pkg.peerDependencies)],
    metafile: true,
    platform: "node",
    plugins: [logPlugin({bundleSizeOptions: {logMode: "both"}})],
    sourcemap: true,
    target: "es2023",
    tsconfig: "tsconfig.lib.json",
  }

  await Promise.all([
    buildOrWatch(
      {
        ...buildOpts,
        entryPoints: ["./src/vscode/index.ts"],
        format: "esm",
        logLevel: IS_WATCH ? "error" : "warning",
        outfile: "dist/vscode/index.js",
        plugins: [
          logPlugin({bundleSizeOptions: {logMode: "both"}}),
          {
            name: "generate metafile",
            setup(build) {
              build.onEnd(async (res) => {
                await writeFile(
                  "build-metafile.json",
                  JSON.stringify(res.metafile),
                  "utf-8",
                )
              })
            },
          },
        ],
      },
      IS_WATCH,
    ),
  ])
}

main(process.argv)
