import {execSync} from "node:child_process"
import {readFile, writeFile} from "node:fs/promises"

function getChangedChangelogs(): string[] {
  try {
    const output = execSync("git diff --name-only --cached", {
      encoding: "utf-8",
    }).trim()

    const changedFiles = output.split("\n").filter(Boolean)
    return changedFiles.filter((file) => file.endsWith("CHANGELOG.md"))
  } catch {
    const output = execSync("git diff --name-only HEAD", {
      encoding: "utf-8",
    }).trim()

    const changedFiles = output.split("\n").filter(Boolean)
    return changedFiles.filter((file) => file.endsWith("CHANGELOG.md"))
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
  const releaseLines = lines
    .slice(firstReleaseIndex, endIndex)
    .filter(
      (line) =>
        !line.startsWith("### Patch Changes") &&
        !line.startsWith("### Minor Changes") &&
        !line.startsWith("### Major Changes"),
    )
  const after = lines.slice(endIndex)

  const consolidated: string[] = []
  const seenSections = new Set<string>()
  let currentSection: string | null = null
  let sectionLines: string[] = []

  for (const line of releaseLines) {
    if (line.startsWith("### ")) {
      if (currentSection && !seenSections.has(currentSection)) {
        seenSections.add(currentSection)
        consolidated.push(currentSection)
        consolidated.push(...sectionLines)
        consolidated.push("")
      } else if (currentSection && seenSections.has(currentSection)) {
        const existingIndex = consolidated.findIndex(
          (l) => l === currentSection,
        )
        const insertIndex = consolidated.findIndex(
          (l, i) =>
            i > existingIndex && (l.startsWith("### ") || l.startsWith("## ")),
        )
        if (insertIndex === -1) {
          consolidated.push(...sectionLines)
        } else {
          consolidated.splice(insertIndex, 0, ...sectionLines)
        }
      }
      currentSection = line
      sectionLines = []
    } else if (currentSection) {
      sectionLines.push(line)
    } else {
      consolidated.push(line)
    }
  }

  if (currentSection) {
    if (!seenSections.has(currentSection)) {
      consolidated.push(currentSection)
      consolidated.push(...sectionLines)
    } else {
      const existingIndex = consolidated.findIndex((l) => l === currentSection)
      const insertIndex = consolidated.findIndex(
        (l, i) =>
          i > existingIndex && (l.startsWith("### ") || l.startsWith("## ")),
      )
      if (insertIndex === -1) {
        consolidated.push(...sectionLines)
      } else {
        consolidated.splice(insertIndex, 0, ...sectionLines)
      }
    }
  }

  const result = [...before, ...consolidated, ...after].join("\n")
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
