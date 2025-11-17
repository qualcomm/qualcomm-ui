import {getPackages} from "@manypkg/get-packages"
import {Octokit} from "@octokit/rest"
import chalk from "chalk"
import {config} from "dotenv"
import {readFile} from "node:fs/promises"
import {resolve} from "node:path"
import {cwd} from "node:process"

config()

const octokit = new Octokit({auth: process.env.TOKEN})

/**
 * Parses a changelog file to extract the latest version entry.
 *
 * @param path - Path to the CHANGELOG.md file
 * @returns Object containing version, date, and body of the latest entry, or null if parsing fails
 */
async function parseChangelog(path: string) {
  const content = await readFile(path, "utf-8")
  const lines = content.split("\n")
  const firstVersionIndex = lines.findIndex((l) => l.startsWith("## "))
  if (firstVersionIndex === -1) {
    console.log(`  No version header found`)
    return null
  }
  const headerLine = lines[firstVersionIndex]
  const match = headerLine.match(/^## ([\d.]+) \((\d{4}\/\d{2}\/\d{2})\)/)
  if (!match) {
    console.log(`  Invalid version format: ${headerLine}`)
    return null
  }
  const [, version, date] = match
  const endIndex = lines.findIndex(
    (l, i) => i > firstVersionIndex && l.startsWith("## "),
  )
  const body = lines
    .slice(firstVersionIndex + 1, endIndex === -1 ? undefined : endIndex)
    .join("\n")
    .trim()
  return {body, date, version}
}

/**
 * Retrieves all packages in the monorepo that should be published.
 * Filters out packages marked as private (except specific Angular packages) and
 * ignored packages.
 *
 * @returns Array of package objects that are eligible for publishing
 */
async function getPublishablePackages() {
  const {packages} = await getPackages(cwd())
  const changesetConfig = JSON.parse(
    await readFile(resolve(cwd(), ".changeset/config.json"), "utf-8"),
  )
  const publishablePrivatePackages = new Set([
    "@qualcomm-ui/angular",
    "@qualcomm-ui/angular-core",
  ])
  const ignoredPackages = new Set(changesetConfig.ignored ?? [])
  return packages.filter((pkg) => {
    if (ignoredPackages.has(pkg.packageJson.name)) {
      return false
    }
    if (!pkg.packageJson.version) {
      return false
    }
    if (!pkg.packageJson.private) {
      return true
    }
    return publishablePrivatePackages.has(pkg.packageJson.name)
  })
}

for (const pkg of await getPublishablePackages()) {
  const changelogPath = `${pkg.dir}/CHANGELOG.md`
  const changelog = await parseChangelog(changelogPath).catch(() => null)
  if (!changelog) {
    console.warn("no changelog found, skipping package:", pkg.packageJson.name)
    continue
  }
  if (changelog.version !== pkg.packageJson.version) {
    console.log(
      `Skipping ${pkg.packageJson.name}: changelog ${changelog.version} ≠ package.json ${pkg.packageJson.version}`,
    )
    continue
  }
  const tag = `${pkg.packageJson.name}@${changelog.version}`
  const repoOpts: {
    owner: string
    repo: string
  } = {
    owner: "qualcomm",
    repo: "qualcomm-ui",
  }
  const release = await octokit.repos
    .getReleaseByTag({
      ...repoOpts,
      tag,
    })
    .catch(() => null)
  if (release) {
    console.log(
      `Release ${chalk.yellowBright(release.data.name)} already exists, skipping`,
    )
    continue
  }
  console.log(`Creating release: ${chalk.cyanBright(tag)}`)
  await octokit.repos.createRelease({
    ...repoOpts,
    body: changelog.body,
    name: tag,
    tag_name: tag,
  })
}
