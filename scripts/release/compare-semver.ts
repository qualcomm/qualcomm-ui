// scripts/check-versions.mjs
import {getPackagesSync} from "@manypkg/get-packages"
import {appendFileSync} from "node:fs"

const {packages} = getPackagesSync(process.cwd())

async function getPublishedVersion(packageName) {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${packageName}: ${response.status}`)
  }

  const data = await response.json()
  return data["dist-tags"]?.latest
}

function compareVersions(current, published) {
  const [cMajor, cMinor, cPatch] = current.split(".").map(Number)
  const [pMajor, pMinor, pPatch] = published.split(".").map(Number)

  if (cMajor !== pMajor) {
    return cMajor - pMajor
  }
  if (cMinor !== pMinor) {
    return cMinor - pMinor
  }
  return cPatch - pPatch
}

const results = await Promise.all(
  packages.map(async (pkg) => {
    const {packageJson} = pkg
    const {name, private: isPrivate, version} = packageJson

    if (isPrivate) {
      return {name, skipped: true}
    }

    const published = await getPublishedVersion(name)

    if (!published) {
      return {name, unpublished: true, version}
    }

    const comparison = compareVersions(version, published)

    return {
      current: version,
      isNewer: comparison > 0,
      isOlder: comparison < 0,
      isSame: comparison === 0,
      name,
      published,
    }
  }),
)

const newer = results.filter((r) => r.isNewer)

if (newer.length > 0) {
  console.log("The following packages will be published:")
  newer.forEach((r) =>
    console.log(`  ${r.name}: ${r.current} > ${r.published}`),
  )
}

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `should-publish=${newer.length > 0}\n`,
  )
}
