const changelogFunctions = {
  getDependencyReleaseLine: async (
    changesets,
    dependenciesUpdated,
    options,
  ) => {
    if (!options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["./changelog.js", { "repo": "org/repo" }]',
      )
    }
    if (dependenciesUpdated.length === 0) {
      return ""
    }

    const deps = dependenciesUpdated.map((d) => d.name).join(", ")
    return `### Miscellaneous Chores\n* **deps:** update dependencies [${deps}]`
  },

  getReleaseLine: async (changeset, type, options) => {
    if (!options?.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["./changelog.js", { "repo": "org/repo" }]',
      )
    }

    const cleanedSummary = changeset.summary
      .split("\n")
      .filter((line) => !line.trim().toLowerCase().startsWith("signed-off-by:"))
      .join("\n")
      .trim()

    const prMatch = cleanedSummary.match(/\(#(\d+)\)/)
    const prNumber = prMatch?.[1]

    const typeMatch = cleanedSummary.match(
      /^(feat|fix|refactor|chore|perf|test|docs|style|ci|build)\s*(\(.+?\))?!?:\s*/i,
    )
    const conventionalType = typeMatch?.[1]?.toLowerCase()
    const scope = typeMatch?.[2]?.replace("(", "").replace(")", "") // Capture scope like "(avatar)"
    const isBreaking =
      cleanedSummary.includes("!:") ||
      cleanedSummary.toLowerCase().includes("breaking")
    const summary = cleanedSummary
      .replace(
        /^(feat|fix|refactor|chore|perf|test|docs|style|ci|build)\s*(\(.+?\))?!?:\s*/i,
        "",
      )
      .replace(/\s*\(#\d+\)\s*$/, "")
      .trim()

    const typeMap = {
      build: "Build System",
      chore: "Miscellaneous Chores",
      ci: "Continuous Integration",
      docs: "Documentation",
      feat: "Features",
      fix: "Bug Fixes",
      perf: "Performance Improvements",
      refactor: "Code Refactoring",
      style: "Styles",
      test: "Tests",
    }

    const section = isBreaking
      ? "BREAKING CHANGES"
      : typeMap[conventionalType] || "Miscellaneous"

    let line = `### ${section}\n* ${scope ? `[${scope}]: ` : ""}${summary}`

    if (prNumber) {
      line += ` ([#${prNumber}](https://github.com/${options.repo}/issues/${prNumber}))`
    }

    if (changeset.commit) {
      const shortCommit = changeset.commit.slice(0, 7)
      line += ` ([${shortCommit}](https://github.com/${options.repo}/commit/${changeset.commit}))`
    }

    return line
  },
}

module.exports = changelogFunctions
