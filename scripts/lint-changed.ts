import {execSync} from "node:child_process"

const baseSha = process.argv[2]
if (!baseSha) {
  console.error("Usage: tsx scripts/lint-changed.ts <base-sha>")
  process.exit(1)
}

const mergeBase = execSync(`git merge-base HEAD ${baseSha}`, {
  encoding: "utf-8",
}).trim()

const changedFiles = execSync(
  `git diff --name-only --diff-filter=ACMRT ${mergeBase}`,
  {encoding: "utf-8"},
)
  .split("\n")
  .filter((file) => /\.(ts|tsx|js|jsx)$/.test(file))
  .filter(Boolean)

if (changedFiles.length === 0) {
  console.log("No files to lint")
  process.exit(0)
}

const BATCH_SIZE = 35
for (let i = 0; i < changedFiles.length; i += BATCH_SIZE) {
  const batch = changedFiles.slice(i, i + BATCH_SIZE)
  execSync(`pnpm eslint --quiet ${batch.join(" ")}`, {stdio: "inherit"})
}
