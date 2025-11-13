#! /usr/bin/env node

// Modified from https://github.com/iamchathu/changeset-conventional-commits
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import readChangeset from "@changesets/read"
import writeChangeset from "@changesets/write"
import {getPackagesSync} from "@manypkg/get-packages"
import {execSync} from "child_process"
import {readFileSync} from "node:fs"
import {join} from "node:path"

import {
  associateCommitsToConventionalCommitMessages,
  conventionalMessagesWithCommitsToChangesets,
  difference,
  getCommitsSinceRef,
} from "./utils"

const CHANGESET_CONFIG_LOCATION = join(".changeset", "config.json")

async function conventionalCommitChangeset(cwd: string = process.cwd()) {
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

  const commitsSinceBase = getCommitsSinceRef(baseBranch)

  const commitsWithMessages = commitsSinceBase.map((commitHash) => ({
    commitHash,
    commitMessage: execSync(
      `git log -n 1 --pretty=format:%B ${commitHash}`,
    ).toString(),
  }))

  const changelogMessagesWithAssociatedCommits =
    associateCommitsToConventionalCommitMessages(commitsWithMessages)

  const changesets = conventionalMessagesWithCommitsToChangesets(
    changelogMessagesWithAssociatedCommits,
    {
      ignoredFiles: ignored,
      packages,
    },
  )

  const currentChangesets = await readChangeset(cwd)

  const newChangesets =
    currentChangesets.length === 0
      ? changesets
      : difference(changesets, currentChangesets)

  newChangesets.forEach((changeset) => writeChangeset(changeset, cwd))
}

conventionalCommitChangeset()
