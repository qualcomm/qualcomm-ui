import dayjs from "dayjs"
import {execSync} from "node:child_process"
import {readFile, writeFile} from "node:fs/promises"

function getChangedChangelogs(): string[] {
  try {
    const output = execSync("git diff --name-only HEAD", {
      encoding: "utf-8",
    }).trim()

    const changedFiles = output.split("\n").filter(Boolean)
    return changedFiles.filter((file) => file.endsWith("CHANGELOG.md"))
  } catch {
    console.error("Failed to get changed files from git diff")
    process.exit(1)
  }
}

async function consolidateChangelog(changelogPath: string): Promise<void> {
  const changelog = await readFile(changelogPath, "utf-8")
  const lines = changelog.split("\n")

  const firstReleaseIndex = lines.findIndex((line) => line.startsWith("## "))
  if (firstReleaseIndex === -1) {
    return
  }

  const secondReleaseIndex = lines.findIndex(
    (line, i) => i > firstReleaseIndex && line.startsWith("## "),
  )

  const endIndex = secondReleaseIndex === -1 ? lines.length : secondReleaseIndex

  const before = lines.slice(0, firstReleaseIndex)
  const releaseLines = lines.slice(firstReleaseIndex, endIndex)
  const after = lines.slice(endIndex)

  const sections = new Map<string, string[]>()
  let versionLine = ""
  let currentSection = ""

  for (const line of releaseLines) {
    if (line.startsWith("## ")) {
      versionLine = line
      if (!line.match(/\(\d{4}\/\d{2}\/\d{2}\)/)) {
        const date = dayjs().format("YYYY/MM/DD")
        versionLine = `${line} (${date})`
      }
      continue
    }

    if (
      line.startsWith("### Patch Changes") ||
      line.startsWith("### Minor Changes") ||
      line.startsWith("### Major Changes")
    ) {
      continue
    }

    if (line.startsWith("### ")) {
      currentSection = line
      if (!sections.has(currentSection)) {
        sections.set(currentSection, [])
      }
      continue
    }

    if (currentSection && line.trim()) {
      sections.get(currentSection).push(line.trim())
    }
  }

  const output: string[] = []
  output.push(versionLine)
  output.push("")

  for (const [section, items] of sections) {
    if (items.length === 0) {
      continue
    }
    output.push(section)
    output.push("")
    output.push(...items)
    output.push("")
  }

  const result = [...before, ...output, ...after].join("\n")
  await writeFile(changelogPath, result)
}

const changedChangelogs = getChangedChangelogs()

if (changedChangelogs.length === 0) {
  console.log("No changelogs changed")
  process.exit(0)
}

console.log(`Consolidating ${changedChangelogs.length} changelog(s)...`)

for (const changelogPath of changedChangelogs) {
  console.log(`  - ${changelogPath}`)
  await consolidateChangelog(changelogPath)
}

console.log("Done")
