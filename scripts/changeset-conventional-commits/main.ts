#! /usr/bin/env node

// Modified from https://github.com/iamchathu/changeset-conventional-commits
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import readChangeset from "@changesets/read"
import writeChangeset from "@changesets/write"
import {Command} from "@commander-js/extra-typings"
import {getPackagesSync} from "@manypkg/get-packages"
import {execSync} from "node:child_process"
import {readFileSync} from "node:fs"
import {join} from "node:path"
import {fileURLToPath} from "node:url"

import {
  conventionalMessagesWithCommitsToChangesets,
  difference,
  getCommitsSincePackageRelease,
  getCommitsSinceRef,
  translateCommitsToConventionalCommitMessages,
} from "./utils"

const CHANGESET_CONFIG_LOCATION = join(".changeset", "config.json")

function getCommitsWithMessages(commitHashes: string[]) {
  return commitHashes.map((commitHash) => {
    const commitMessage = execSync(
      `git log -n 1 --pretty=format:%B ${commitHash}`,
    ).toString()
    return {
      commitHash,
      commitMessage,
    }
  })
}

export interface ChangesetGenerateOptions {
  fromReleaseTags?: boolean | undefined
  includeCommitLinks?: boolean | undefined
}

export async function conventionalCommitChangeset(
  options: ChangesetGenerateOptions,
  cwd: string = process.cwd(),
) {
  const changesetConfig = JSON.parse(
    readFileSync(join(cwd, CHANGESET_CONFIG_LOCATION)).toString(),
  )
  const ignored = changesetConfig.ignore ?? []
  const packages = getPackagesSync(cwd).packages.filter(
    (pkg) =>
      Boolean(pkg.packageJson.version) &&
      !ignored.includes(pkg.packageJson.name),
  )

  const {baseBranch = "main"} = changesetConfig
  const {fromReleaseTags, includeCommitLinks} = options

  let changesets

  if (fromReleaseTags) {
    // Per-package diffing from each package's release tag
    const allChangesets = packages.flatMap((pkg) => {
      const packageName = pkg.packageJson.name
      const version = pkg.packageJson.version
      if (!packageName || !version) {
        return []
      }

      const commitsSinceRelease = getCommitsSincePackageRelease(
        packageName,
        version,
        baseBranch,
      )

      const commitsWithMessages = getCommitsWithMessages(commitsSinceRelease)
      const changelogMessages =
        translateCommitsToConventionalCommitMessages(commitsWithMessages)

      return conventionalMessagesWithCommitsToChangesets(changelogMessages, {
        ignoredFiles: ignored,
        includeCommitLinks,
        packages: [pkg],
      })
    })

    // Deduplicate changesets with same summary and releases
    changesets = allChangesets.filter(
      (changeset, index, self) =>
        index ===
        self.findIndex(
          (c) =>
            c.summary === changeset.summary &&
            JSON.stringify(c.releases) === JSON.stringify(changeset.releases),
        ),
    )
  } else {
    // Original behavior: diff from base branch
    const commitsSinceBase = getCommitsSinceRef(baseBranch)
    const commitsWithMessages = getCommitsWithMessages(commitsSinceBase)
    const changelogMessagesWithAssociatedCommits =
      translateCommitsToConventionalCommitMessages(commitsWithMessages)

    changesets = conventionalMessagesWithCommitsToChangesets(
      changelogMessagesWithAssociatedCommits,
      {
        ignoredFiles: ignored,
        includeCommitLinks,
        packages,
      },
    )
  }

  const currentChangesets = await readChangeset(cwd)

  const newChangesets =
    currentChangesets.length === 0
      ? changesets
      : difference(changesets, currentChangesets)

  await Promise.all(
    newChangesets.map((changeset) => writeChangeset(changeset, cwd)),
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const program = new Command()
    .name("changeset-generate")
    .description("Generate changesets from conventional commits")
    .option(
      "--from-release-tags",
      "Diff each package from its most recent release tag instead of the base branch",
      false,
    )
    .option(
      "--include-commit-links",
      "Embed commit hashes in changeset summaries for changelog links",
      false,
    )
    .action((options) => conventionalCommitChangeset(options))

  program.parse()
}
