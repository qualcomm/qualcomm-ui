import type {BuildOptions} from "esbuild"

import {buildOrWatch, hasArg} from "@qualcomm-ui/esbuild"

async function main(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")

  const buildOpts: BuildOptions = {
    bundle: true,
    entryPoints: ["./src/cli.ts"],
    outdir: "dist",
    platform: "node",
    sourcemap: true,
    target: "es2023",
    tsconfig: "tsconfig.lib.json",
  }

  await Promise.all([
    buildOrWatch(
      {
        ...buildOpts,
        format: "cjs",
        logLevel: IS_WATCH ? "error" : "warning",
        outExtension: {".js": ".cjs"},
      },
      IS_WATCH,
    ),
  ])
}

main(process.argv)
