// Modified from https://github.com/iamchathu/changeset-conventional-commits
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear
import type {Changeset, PackageJSON} from "@changesets/types"
import {execSync} from "node:child_process"

interface ManyPkgPackage {
  dir: string
  packageJson: PackageJSON
}

interface Commit {
  commitHash: string
  commitMessage: string
}

interface ConventionalMessagesToCommits {
  changelogMessage: string
  commitHashes: string[]
}

const defaultCommitTypes = [
  {section: "Features", type: "feat"},
  {section: "Features", type: "feature"},
  {section: "Bug Fixes", type: "fix"},
  {section: "Performance Improvements", type: "perf"},
  {section: "Reverts", type: "revert"},
  {section: "Documentation", type: "docs"},
  {section: "Styles", type: "style"},
  {section: "Miscellaneous Chores", type: "chore"},
  {section: "Code Refactoring", type: "refactor"},
  {section: "Tests", type: "test"},
  {section: "Build System", type: "build"},
  {section: "Continuous Integration", type: "ci"},
]

/**
 * Normalizes conventional commit format by removing whitespace between type and
 * scope. Transforms "fix (scope): message" to "fix(scope): message"
 * @param commit - The commit message to normalize
 * @returns Normalized commit message
 */
function normalizeConventionalCommit(commit: string): string {
  return commit.replace(/^(\w+)\s+(\(.*?\))/, "$1$2")
}

/**
 * Checks if a commit message follows conventional commit format
 * @param commit - The commit message to check
 * @returns True if the commit follows conventional commit format
 */
export function isConventionalCommit(commit: string) {
  const normalized = normalizeConventionalCommit(commit)
  return defaultCommitTypes.some((commitType) =>
    normalized.match(new RegExp(`^${commitType.type}\\s*(?:\(.*\))?!?:`)),
  )
}

/**
 * Checks if a commit message indicates a breaking change
 * @param commit - The commit message to check
 * @returns True if the commit contains a breaking change indicator
 */
export function isBreakingChange(commit: string) {
  const normalized = normalizeConventionalCommit(commit)
  return (
    normalized.includes("BREAKING CHANGE:") ||
    defaultCommitTypes.some((commitType) =>
      normalized.match(new RegExp(`^${commitType.type}\\s*(?:\(.*\))?!:`)),
    )
  )
}

/**
 * Filters commits to only conventional commits and maps them to changelog format
 * @param commits - Array of commits to translate
 * @returns Array of conventional commit messages with their associated commit hashes
 */
export function translateCommitsToConventionalCommitMessages(
  commits: Commit[],
): ConventionalMessagesToCommits[] {
  return commits
    .filter((commit) => isConventionalCommit(commit.commitMessage))
    .map((commit) => ({
      changelogMessage: normalizeConventionalCommit(commit.commitMessage),
      commitHashes: [commit.commitHash],
    }))
}

/**
 * Gets the list of files changed between two git refs
 * @param opts - Object containing from and to git refs
 * @returns Array of file paths that changed
 */
export function getFilesChangedSince(opts: {from: string; to: string}) {
  return execSync(`git diff --name-only ${opts.from}~1...${opts.to}`)
    .toString()
    .trim()
    .split("\n")
}

/**
 * Gets the absolute path to the git repository root
 * @returns Absolute path to repository root
 */
export function getRepoRoot() {
  return execSync("git rev-parse --show-toplevel")
    .toString()
    .trim()
    .replace(/\n|\r/g, "")
}

/**
 * Gets the full commit message for a given commit hash
 * @param commitHash - The git commit hash
 * @returns The full commit message
 */
function getCommitMessage(commitHash: string): string {
  return execSync(`git log -1 --pretty=%B ${commitHash}`).toString().trim()
}

/**
 * Extracts all conventional commit messages from a multi-line commit message
 * @param commitMessage - The commit message to parse
 * @returns Array of conventional commit messages found
 */
function extractConventionalCommits(commitMessage: string): string[] {
  const lines = commitMessage.split("\n")
  const conventionalCommits: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && isConventionalCommit(trimmed)) {
      conventionalCommits.push(normalizeConventionalCommit(trimmed))
    }
  }
  return conventionalCommits
}

/**
 * Converts conventional commit messages to changesets based on affected packages
 * @param conventionalMessagesToCommits - Array of conventional messages with their commit hashes
 * @param options - Configuration options including ignored files and packages
 * @returns Array of changesets for affected packages
 */
export function conventionalMessagesWithCommitsToChangesets(
  conventionalMessagesToCommits: ConventionalMessagesToCommits[],
  options: {ignoredFiles?: (string | RegExp)[]; packages: ManyPkgPackage[]},
) {
  const {ignoredFiles = [], packages} = options
  return conventionalMessagesToCommits
    .flatMap((entry) => {
      const filesChanged = getFilesChangedSince({
        from: entry.commitHashes[0],
        to: entry.commitHashes[entry.commitHashes.length - 1],
      }).filter((file) => {
        return ignoredFiles.every(
          (ignoredPattern) => !file.match(ignoredPattern),
        )
      })
      const packagesChanged = packages.filter((pkg) => {
        const pkgPath = pkg.dir.replace(`${getRepoRoot()}/`, "")
        return filesChanged.some((file) => file.startsWith(`${pkgPath}/`))
      })
      if (packagesChanged.length === 0) {
        return []
      }
      const allConventionalCommits = entry.commitHashes
        .flatMap((hash) => {
          const fullMessage = getCommitMessage(hash)
          return extractConventionalCommits(fullMessage)
        })
        .filter((msg, index, self) => self.indexOf(msg) === index)
      return allConventionalCommits.flatMap((conventionalCommit) => {
        const changeType = isBreakingChange(conventionalCommit)
          ? "major"
          : conventionalCommit.startsWith("feat")
            ? "minor"
            : "patch"
        return {
          packagesChanged,
          releases: packagesChanged.map((pkg) => ({
            name: pkg.packageJson.name,
            type: changeType,
          })),
          summary: conventionalCommit,
        } as Changeset
      })
    })
    .filter(Boolean)
}

/**
 * Fetches the latest changes from a remote branch
 * @param branch - The branch name to fetch
 */
export function gitFetch(branch: string) {
  execSync(`git fetch origin ${branch}`)
}

/**
 * Gets the name of the current git branch
 * @returns Current branch name
 */
export function getCurrentBranch() {
  return execSync("git rev-parse --abbrev-ref HEAD").toString().trim()
}

/**
 * Gets all commit hashes since a reference branch or tag
 * @param branch - The branch to compare against
 * @returns Array of commit hashes since the reference point
 */
export function getCommitsSinceRef(branch: string) {
  gitFetch(branch)
  const currentBranch = getCurrentBranch()
  let sinceRef = `origin/${branch}`

  if (currentBranch === branch) {
    try {
      sinceRef = execSync("git describe --tags --abbrev=0").toString()
    } catch (e) {
      console.log(
        "No git tags found, using repo's first commit for automated change detection. Note: this may take a while.",
      )
      sinceRef = execSync("git rev-list --max-parents=0 HEAD").toString()
    }
  }

  sinceRef = sinceRef.trim()
  return execSync(`git rev-list ${sinceRef}..HEAD`)
    .toString()
    .split("\n")
    .filter(Boolean)
    .reverse()
}

/**
 * Compares two changesets for equality
 * @param a - First changeset
 * @param b - Second changeset
 * @returns True if changesets are equal
 */
function compareChangeSet(a: Changeset, b: Changeset): boolean {
  return (
    a.summary.replace(/\n$/, "") === b.summary &&
    JSON.stringify(a.releases) === JSON.stringify(b.releases)
  )
}

/**
 * Returns changesets in array a that are not in array b
 * @param a - Array of changesets to filter
 * @param b - Array of changesets to compare against
 * @returns Changesets that exist in a but not in b
 */
export function difference(a: Changeset[], b: Changeset[]): Changeset[] {
  return a.filter(
    (changeA) => !b.some((changeB) => compareChangeSet(changeA, changeB)),
  )
}
