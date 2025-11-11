import {execSync} from "node:child_process"

const baseSha = process.env.GITHUB_BASE_SHA
if (!baseSha) {
  console.error("GITHUB_BASE_SHA not set")
  process.exit(1)
}

const changedFiles = execSync(
  `git diff --name-only --diff-filter=ACMRT ${baseSha} HEAD`,
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
