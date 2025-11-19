import {getPackages} from "@manypkg/get-packages"
import {readFile} from "node:fs/promises"
import {resolve} from "node:path"
import {cwd} from "node:process"

/**
 * Retrieves all packages in the monorepo that should be published.
 * Filters out packages marked as private (except specific Angular packages) and
 * ignored packages.
 *
 * @returns Array of package objects that are eligible for publishing
 */
export async function getPublishablePackages() {
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
