import {Command} from "@commander-js/extra-typings"
import {getPackages} from "@manypkg/get-packages"
import {execaCommand} from "execa"
import {readFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {cwd} from "node:process"
import {fileURLToPath} from "node:url"

import type {PackageTiming} from "./types"

const __dirname = dirname(fileURLToPath(import.meta.url))

const program = new Command()
  .requiredOption("-s, --shard <string>", "Shard")
  .parse(process.argv)

const opts = program.opts()

function distributePackages(
  packages: PackageTiming[],
  totalShards: number,
): PackageTiming[][] {
  const shards: PackageTiming[][] = Array.from({length: totalShards}, () => [])
  const shardTimes = Array(totalShards).fill(0)

  const sorted = [...packages].sort((a, b) => b.duration - a.duration)

  for (const pkg of sorted) {
    const minIndex = shardTimes.indexOf(Math.min(...shardTimes))
    shards[minIndex].push(pkg)
    shardTimes[minIndex] += pkg.duration
  }

  return shards
}

async function main() {
  const [shard, total] = opts.shard.split("/")
  const shardNumber = parseInt(shard)
  const totalShards = parseInt(total)

  if (typeof shardNumber !== "number" || typeof totalShards !== "number") {
    throw new Error("Invalid shard, expected format: 1/3")
  }

  console.log(`Running lint shard ${shardNumber} of ${totalShards}`)

  const packages = await getPackages(cwd())

  let shardPackages: string[]

  try {
    const timingsPath = resolve(__dirname, "../.lint-cache/timings.json")
    const timingsData = await readFile(timingsPath, "utf-8")
    const timings: PackageTiming[] = JSON.parse(timingsData)

    if (
      timings.length !== packages.packages.length ||
      packages.packages.some(
        (pkg) => !timings.find((time) => time.package === pkg.packageJson.name),
      )
    ) {
      throw new Error(
        "Missing timing data for some packages. Run profile-lint first.",
      )
    }

    const shards = distributePackages(timings, totalShards)
    const shard = shards[shardNumber - 1]
    shardPackages = shard.map((t) => t.package)

    const totalTime = shard.reduce((sum, t) => sum + t.duration, 0)
    console.log(
      `Shard contains ${shardPackages.length} packages (~${Math.round(totalTime)}ms)`,
    )
  } catch {
    console.log(
      "Timing data missing or invalid. Falling back to even distribution",
    )
    const shardSize = Math.ceil(packages.packages.length / totalShards)
    const shardStart = (shardNumber - 1) * shardSize
    const shardEnd = Math.min(shardStart + shardSize, packages.packages.length)
    shardPackages = packages.packages
      .slice(shardStart, shardEnd)
      .map((p) => p.packageJson.name)
  }

  const command = `pnpm lint:ci ${shardPackages.map((pkg) => `--filter ${pkg}`).join(" ")}`
  await execaCommand(command, {
    cwd: resolve(__dirname, "../"),
    stdio: "inherit",
  })
}

await main()
