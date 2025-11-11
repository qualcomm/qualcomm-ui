import {execSync} from "node:child_process"

const baseRef = process.env.GITHUB_EVENT_BEFORE || process.env.GITHUB_BASE_REF
if (!baseRef) {
  console.error("No base ref found")
  process.exit(1)
}

const changedFiles = execSync(
  `git diff --name-only --diff-filter=ACMRT ${baseRef} HEAD`,
  {encoding: "utf-8"},
)
  .split("\n")
  .filter((file) => /\.(ts|tsx|js|jsx)$/.test(file))
  .filter(Boolean)

if (changedFiles.length === 0) {
  console.log("No files to lint")
  process.exit(0)
}

execSync(`pnpm eslint ${changedFiles.join(" ")}`, {stdio: "inherit"})
