/**
 * We use a workaround to trick the Angular packager (ng-packagr) to treat all
 * directories in `src` as package entrypoints. This requires us to use a dummy
 * package.json in src/ in order for the build process to work. We do this before
 * every publish so that the correct information is there in the deployed package.
 */
import {readFile, writeFile} from "node:fs/promises"

const rootPkg = JSON.parse(await readFile("./package.json", "utf-8"))

const distPkg = JSON.parse(await readFile("./dist/package.json", "utf-8"))

await writeFile(
  "./dist/package.json",
  JSON.stringify(
    {
      ...distPkg,
      peerDependencies: rootPkg.peerDependencies,
      version: rootPkg.version,
    },
    null,
    2,
  ),
  "utf-8",
)
