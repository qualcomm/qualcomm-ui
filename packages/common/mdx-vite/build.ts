import type {BuildOptions} from "esbuild"
import {cp, mkdir, writeFile} from "node:fs/promises"
import {resolve} from "node:path"

import {buildOrWatch, hasArg, logPlugin} from "@qualcomm-ui/esbuild"

import pkgJson from "./package.json"

async function copyVirtualModules() {
  await mkdir(resolve("./dist/angular-demo-plugin"), {recursive: true}).catch()
  await mkdir(resolve("./dist/docs-plugin"), {recursive: true}).catch()
  await mkdir(resolve("./dist/react-demo-plugin"), {recursive: true}).catch()

  await cp(
    resolve("./src/docs-plugin/virtual.d.ts"),
    resolve("./dist/docs-plugin/virtual.d.ts"),
  ).catch()
  await cp(
    resolve("./src/angular-demo-plugin/virtual.d.ts"),
    resolve("./dist/angular-demo-plugin/virtual.d.ts"),
  ).catch()
  await cp(
    resolve("./src/react-demo-plugin/virtual.d.ts"),
    resolve("./dist/react-demo-plugin/virtual.d.ts"),
  ).catch()
}

async function main(argv: string[]) {
  const IS_WATCH = hasArg(argv, "--watch")

  const buildOpts: BuildOptions = {
    bundle: true,
    external: [
      ...Object.keys(pkgJson.dependencies ?? {}),
      ...Object.keys(pkgJson.devDependencies ?? {}),
      ...Object.keys(pkgJson.peerDependencies ?? {}),
    ],
    metafile: true,
    platform: "node",
    plugins: [logPlugin({bundleSizeOptions: {logMode: "both"}})],
    sourcemap: true,
    target: "es2023",
    tsconfig: "tsconfig.lib.json",
  }

  await copyVirtualModules()

  await Promise.all([
    buildOrWatch(
      {
        banner: {
          // convert `require` to ESM-compatible syntax.
          js: [
            `import {createRequire} from "node:module";`,
            `const require=createRequire(import.meta.url);`,
          ].join(""),
        },
        ...buildOpts,
        entryPoints: ["src/cli.ts"],
        format: "esm",
        logLevel: IS_WATCH ? "error" : "warning",
        outfile: "./dist/cli.js",
      },
      IS_WATCH,
    ),
    buildOrWatch(
      {
        ...buildOpts,
        banner: {
          js: [
            `import {createRequire} from "node:module";`,
            `const require=createRequire(import.meta.url);`,
          ].join(""),
        },
        entryPoints: ["./src/index.ts"],
        format: "esm",
        logLevel: IS_WATCH ? "error" : "warning",
        outfile: "dist/index.js",
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
