// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface VersionBump {
  /** Major version the codemod migrates from. */
  from: number
  /** Major version the codemod migrates to. */
  to: number
}

export interface CodemodContext {
  /** The project root, i.e. the directory containing package.json. */
  cwd: string
  /** Preview changes without writing files. */
  dryRun: boolean
}

export type CodemodFileStatus =
  /** The file was modified. */
  | "updated"
  /** The file is already migrated. */
  | "unchanged"
  /** The file was inspected but doesn't need this codemod. */
  | "skipped"
  /** The file needs migrating, but must be updated manually. */
  | "conflict"

export interface CodemodFileResult {
  /** Absolute path to the file. */
  file: string
  /**
   * What happened to the file, in plain language. Shown after the file path,
   * e.g. "added the NotFoundRoute default export".
   */
  message: string
  status: CodemodFileStatus
}

export interface Codemod<TPackage extends string = string> {
  name: string
  /**
   * Shown when the codemod finds no files to change, e.g. "no $.tsx route
   * found".
   */
  noMatchMessage: string
  run: (ctx: CodemodContext) => Promise<CodemodFileResult[]>
  /** What the codemod does, shown as its heading in the CLI output. */
  title: string
  /**
   * The major version bumps covered by this codemod, keyed by package name. Each
   * entry is optional. The codemod runs when any listed package is detected at
   * or past its `from` version, so codemods must be idempotent.
   */
  versions: Partial<Record<TPackage, VersionBump>>
}

export interface MigrationGroup<TPackage extends string = string> {
  /**
   * Codemods in the group. Order matters: codemods run in sequence and each
   * one sees the versions produced by the previous ones, so list them from
   * oldest to newest.
   */
  codemods: Codemod<TPackage>[]
  description: string
  name: string
  /** The packages whose versions are detected for this group. */
  packages: readonly TPackage[]
}
