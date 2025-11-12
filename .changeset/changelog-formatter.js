async function getReleaseLine(changeset, type, options) {
  const repo = options?.repo || "qualcomm/qualcomm-ui"

  const prMatch = changeset.summary.match(/\(#(\d+)\)/)
  const prNumber = prMatch?.[1]

  const summary = changeset.summary.replace(/\s*\(#\d+\)\s*$/, "").trim()

  let line = `* ${summary}`

  if (prNumber) {
    line += ` ([#${prNumber}](https://github.com/${repo}/issues/${prNumber}))`
  }

  if (changeset.commit) {
    line += ` ([${changeset.commit.slice(0, 7)}](https://github.com/${repo}/commit/${changeset.commit}))`
  }

  return line
}

async function getDependencyReleaseLine(
  changesets,
  dependenciesUpdated,
  options,
) {
  if (dependenciesUpdated.length === 0) {
    return ""
  }

  const deps = dependenciesUpdated.map((d) => d.name).join(", ")
  return `* Updated dependencies [${deps}]`
}

module.exports = {
  getDependencyReleaseLine,
  getReleaseLine,
}
