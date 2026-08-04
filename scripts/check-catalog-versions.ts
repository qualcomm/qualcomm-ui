import {program} from "@commander-js/extra-typings"
import {mkdir, readFile, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {run as ncu} from "npm-check-updates"
import {parseDocument, type YAMLMap} from "yaml"

const cli = program
  .name("check-catalog-versions")
  .description(
    "Check pnpm catalog for outdated packages using npm-check-updates",
  )
  .option("-u, --upgrade", "Overwrite catalog with upgraded versions")
  .option(
    "-c, --cooldown <days>",
    "Minimum age in days for a version to be considered",
  )
  .option(
    "-t, --target <target>",
    "Target version: latest, newest, greatest, minor, patch",
  )
  .option(
    "-f, --filter <pattern>",
    "Include only package names matching the pattern",
  )
  .option(
    "-x, --reject <pattern>",
    "Exclude package names matching the pattern",
  )
  .option("-i, --interactive", "Enable interactive mode")
  .argument("[file]", "Path to pnpm-workspace.yaml", "pnpm-workspace.yaml")
  .parse()

const opts = cli.opts()
const [workspaceFile] = cli.processedArgs

const content = await readFile(workspaceFile, "utf-8")
const doc = parseDocument(content)
const catalogNode = doc.get("catalog", true) as YAMLMap | undefined

if (!catalogNode) {
  console.error("No catalog found in", workspaceFile)
  process.exit(1)
}

const catalog = catalogNode.toJSON() as Record<string, string>

const tempDir = join(tmpdir(), `ncu-catalog-${Date.now()}`)
await mkdir(tempDir, {recursive: true})
const tempPackageJson = join(tempDir, "package.json")

await writeFile(
  tempPackageJson,
  JSON.stringify({dependencies: catalog}, null, 2),
)

try {
  const upgraded = (await ncu({
    cooldown: opts.cooldown ? parseInt(opts.cooldown, 10) : undefined,
    filter: opts.filter,
    interactive: opts.interactive,
    packageFile: tempPackageJson,
    reject: opts.reject,
    target: opts.target as "latest" | "newest" | "greatest" | "minor" | "patch",
    upgrade: opts.upgrade,
  })) as Record<string, string> | undefined

  if (!upgraded || Object.keys(upgraded).length === 0) {
    console.log("All packages are up to date.")
  } else {
    const nameWidth = Math.max(...Object.keys(upgraded).map((n) => n.length))
    const currentWidth = Math.max(
      ...Object.keys(upgraded).map((n) => catalog[n].length),
    )

    for (const [name, version] of Object.entries(upgraded)) {
      console.log(
        `${name.padEnd(nameWidth)}  ${catalog[name].padEnd(currentWidth)}  →  ${version}`,
      )
    }

    if (opts.upgrade) {
      for (const [name, version] of Object.entries(upgraded)) {
        catalogNode.set(name, version)
      }
      await writeFile(workspaceFile, doc.toString(), "utf-8")
      console.log(`\nUpdated ${workspaceFile}`)
    } else {
      console.log("\nRun with --upgrade to apply changes.")
    }
  }
} finally {
  await rm(tempDir, {force: true, recursive: true})
}
