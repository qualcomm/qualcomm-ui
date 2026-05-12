import {readdir, readFile} from "node:fs/promises"
import {join} from "node:path"

interface PluginManifest {
  name?: string
  version?: string
}

interface ChangelogSection {
  section?: string
  type?: string
}

interface ReleasePleaseExtraFile {
  jsonpath?: string
  path?: string
  type?: string
}

interface ReleasePleasePackageConfig {
  component?: string
  "exclude-paths"?: string[]
  "extra-files"?: ReleasePleaseExtraFile[]
  "release-type"?: string
}

interface ReleasePleaseConfig {
  "changelog-sections"?: ChangelogSection[]
  packages?: Record<string, ReleasePleasePackageConfig>
  "release-type"?: string
}

const expectedChangelogSections: ChangelogSection[] = [
  {section: "Features", type: "feat"},
  {section: "Features", type: "feature"},
  {section: "Bug Fixes", type: "fix"},
  {section: "Performance Improvements", type: "perf"},
  {section: "Reverts", type: "revert"},
  {section: "Documentation", type: "docs"},
  {section: "Styles", type: "style"},
  {section: "Styles", type: "styles"},
  {section: "Miscellaneous Chores", type: "chore"},
  {section: "Code Refactoring", type: "refactor"},
  {section: "Tests", type: "test"},
  {section: "Build System", type: "build"},
  {section: "Continuous Integration", type: "ci"},
]

const failures: string[] = []

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf-8")) as T
}

function fail(message: string) {
  failures.push(message)
}

function expectEqual(actual: unknown, expected: unknown, label: string) {
  if (actual !== expected) {
    fail(
      `${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    )
  }
}

function expectChangelogSections(config: ReleasePleaseConfig) {
  const actual = config["changelog-sections"] ?? []
  expectEqual(
    JSON.stringify(actual),
    JSON.stringify(expectedChangelogSections),
    "release-please changelog-sections",
  )
}

function expectExtraFile(
  pluginPath: string,
  packageConfig: ReleasePleasePackageConfig,
  filePath: string,
) {
  const extraFile = packageConfig["extra-files"]?.find(
    (item) => item.path === filePath,
  )

  if (!extraFile) {
    fail(`${pluginPath}: missing release-please extra-file ${filePath}`)
    return
  }

  expectEqual(
    extraFile.type,
    "json",
    `${pluginPath}: ${filePath} extra-file type`,
  )
  expectEqual(
    extraFile.jsonpath,
    "$.version",
    `${pluginPath}: ${filePath} extra-file jsonpath`,
  )
}

function expectExcludedPath(
  pluginPath: string,
  packageConfig: ReleasePleasePackageConfig,
  filePath: string,
) {
  if (!packageConfig["exclude-paths"]?.includes(filePath)) {
    fail(`${pluginPath}: missing release-please excluded path ${filePath}`)
  }
}

const releasePleaseConfig = await readJson<ReleasePleaseConfig>(
  "release-please-config.json",
)
const releasePleaseManifest = await readJson<Record<string, string>>(
  ".release-please-manifest.json",
)
const pluginEntries = await readdir("plugins", {withFileTypes: true})
const pluginNames = pluginEntries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

expectEqual(
  releasePleaseConfig["release-type"],
  "simple",
  "release-please release-type",
)
expectChangelogSections(releasePleaseConfig)

for (const pluginName of pluginNames) {
  const pluginPath = join("plugins", pluginName)
  const codexManifestPath = join(pluginPath, ".codex-plugin", "plugin.json")
  const claudeManifestPath = join(pluginPath, ".claude-plugin", "plugin.json")
  const versionPath = join(pluginPath, "version.txt")

  const codexManifest = await readJson<PluginManifest>(codexManifestPath)
  const claudeManifest = await readJson<PluginManifest>(claudeManifestPath)
  const versionTxt = (await readFile(versionPath, "utf-8")).trim()
  const releasePleaseVersion = releasePleaseManifest[pluginPath]
  const packageConfig = releasePleaseConfig.packages?.[pluginPath]

  expectEqual(codexManifest.name, pluginName, `${codexManifestPath} name`)
  expectEqual(claudeManifest.name, pluginName, `${claudeManifestPath} name`)
  expectEqual(
    claudeManifest.version,
    codexManifest.version,
    `${pluginPath} manifest versions`,
  )
  expectEqual(versionTxt, codexManifest.version, `${versionPath} version`)
  expectEqual(
    releasePleaseVersion,
    codexManifest.version,
    `.release-please-manifest.json ${pluginPath}`,
  )

  if (!packageConfig) {
    fail(`${pluginPath}: missing release-please package config`)
    continue
  }

  expectEqual(packageConfig.component, pluginName, `${pluginPath} component`)
  expectExcludedPath(pluginPath, packageConfig, `${pluginPath}/version.txt`)
  expectExtraFile(pluginPath, packageConfig, ".codex-plugin/plugin.json")
  expectExtraFile(pluginPath, packageConfig, ".claude-plugin/plugin.json")
}

for (const configuredPath of Object.keys(releasePleaseConfig.packages ?? {})) {
  if (!pluginNames.includes(configuredPath.replace(/^plugins\//, ""))) {
    fail(
      `${configuredPath}: release-please package config has no plugin directory`,
    )
  }
}

for (const manifestPath of Object.keys(releasePleaseManifest)) {
  if (!pluginNames.includes(manifestPath.replace(/^plugins\//, ""))) {
    fail(`${manifestPath}: release-please manifest has no plugin directory`)
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`Validated ${pluginNames.length} plugin release configurations.`)
