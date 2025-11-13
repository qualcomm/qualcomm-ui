import {getPackages} from "@manypkg/get-packages"
import {execaCommand} from "execa"
import {mkdir, writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {cwd} from "node:process"
import {fileURLToPath} from "node:url"

import type {PackageTiming} from "./types"

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  const packages = await getPackages(cwd())

  const timings: PackageTiming[] = []

  for (const {packageJson} of packages.packages) {
    const start = performance.now()
    try {
      await execaCommand(`pnpm lint:ci --filter ${packageJson.name} --force`, {
        cwd: resolve(__dirname, "../"),
        stdio: "ignore",
      })
    } catch {
      console.error(`Failed to lint ${packageJson.name}`)
    }
    const duration = performance.now() - start
    timings.push({duration, package: packageJson.name})
    console.log(`${packageJson.name}: ${Math.round(duration)}ms`)
  }

  const cacheDir = resolve(__dirname, "../.lint-cache")
  await mkdir(cacheDir, {recursive: true})
  await writeFile(
    resolve(cacheDir, "timings.json"),
    JSON.stringify(timings, null, 2),
  )

  console.log(`\nTotal packages: ${packages.packages.length}`)
  console.log(
    `Total time: ${Math.round(timings.reduce((sum, t) => sum + t.duration, 0))}ms`,
  )
}

await main()
