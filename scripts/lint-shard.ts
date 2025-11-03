import {Command} from "@commander-js/extra-typings"
import {execaCommand} from "execa"
import {readdir} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const program = new Command()
  .requiredOption("-s, --shard <string>", "Shard")
  .parse(process.argv)

const opts = program.opts()

async function main() {
  const [shard, total] = opts.shard.split("/")
  const shardNumber = parseInt(shard)
  const totalShards = parseInt(total)
  if (typeof shardNumber !== "number" || typeof totalShards !== "number") {
    throw new Error("Invalid shard, expected format: 1/3")
  }
  console.log(`Running lint shard ${shardNumber} of ${totalShards}`)

  const baseDir = resolve(__dirname, "../packages")

  const folders = await readdir(baseDir)

  // "@qui/<package-folder-name>"
  const packages = (
    await Promise.all(
      folders.map(async (pkgFolder) =>
        (await readdir(resolve(baseDir, pkgFolder))).map(
          (folder) => `@qui/${folder}`,
        ),
      ),
    )
  ).flat()
  const shardSize = Math.ceil(packages.length / totalShards)
  const shardStart = (shardNumber - 1) * shardSize
  const shardEnd = Math.min(shardStart + shardSize, packages.length)
  const shardPackages = packages.slice(shardStart, shardEnd)

  const command = `pnpm lint:ci ${shardPackages.map((pkg) => `--filter ${pkg}`).join(" ")}`

  await execaCommand(command, {
    cwd: resolve(__dirname, "../"),
    stdio: "inherit",
  })
}

await main()
