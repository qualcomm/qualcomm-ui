import {execSync} from "node:child_process"

const base = process.env.GITHUB_BASE_REF || "main"
const changedFiles = execSync(
  `git diff --name-only --diff-filter=ACMRT origin/${base}...HEAD`,
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
