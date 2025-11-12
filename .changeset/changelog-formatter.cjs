import {getInfo, getInfoFromPullRequest} from "@changesets/get-github-info"

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

    let prFromSummary
    let commitFromSummary

    const cleanedSummary = changeset.summary
      .split("\n")
      .filter((line) => !line.trim().toLowerCase().startsWith("signed-off-by:"))
      .join("\n")
      .replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
        const num = Number(pr)
        if (!isNaN(num)) {
          prFromSummary = num
        }
        return ""
      })
      .replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
        commitFromSummary = commit
        return ""
      })
      .replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, () => "")
      .trim()

    const typeMatch = cleanedSummary.match(
      /^(feat|fix|refactor|chore|perf|test|docs|style|ci|build)(\(.+?\))?!?:\s*/i,
    )
    const conventionalType = typeMatch?.[1]?.toLowerCase()
    const isBreaking =
      cleanedSummary.includes("!:") ||
      cleanedSummary.toLowerCase().includes("breaking")

    const summary = cleanedSummary
      .replace(
        /^(feat|fix|refactor|chore|perf|test|docs|style|ci|build)(\(.+?\))?!?:\s*/i,
        "",
      )
      .trim()

    const links = await (async () => {
      if (prFromSummary !== undefined) {
        const {links} = await getInfoFromPullRequest({
          pull: prFromSummary,
          repo: options.repo,
        })
        if (commitFromSummary) {
          const shortCommitId = commitFromSummary.slice(0, 7)
          links.commit = `[\`${shortCommitId}\`](https://github.com/${options.repo}/commit/${commitFromSummary})`
        }
        return links
      }
      const commitToFetchFrom = commitFromSummary || changeset.commit
      if (commitToFetchFrom) {
        const {links} = await getInfo({
          commit: commitToFetchFrom,
          repo: options.repo,
        })
        return links
      }
      return {commit: null, pull: null, user: null}
    })()

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
      ? "⚠ BREAKING CHANGES"
      : typeMap[conventionalType] || "Miscellaneous"

    let line = `### ${section}\n* ${summary}`

    if (links.pull) {
      line += ` (${links.pull})`
    }

    if (links.commit) {
      line += ` (${links.commit})`
    }

    return line
  },
}

export default changelogFunctions
