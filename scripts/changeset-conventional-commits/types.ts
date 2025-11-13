// Modified from https://github.com/iamchathu/changeset-conventional-commits
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface PkgJson {
  bin?: string | Record<string, string>
  browser?: string
  bundledDependencies?: string[]
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  engines?: Record<string, string>
  files?: string[]
  main?: string
  module?: string
  name?: string
  optionalDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  private?: boolean
  scripts?: Record<string, string>
  sideEffects?: boolean
  types?: string
  typings?: string
  unpkg?: string
  version?: string
  workspaces?: string[]
}

export interface ManyPkgPackage {
  dir: string
  packageJson: PkgJson
}
