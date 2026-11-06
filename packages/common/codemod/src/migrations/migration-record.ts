// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {readFile, writeFile} from "node:fs/promises"
import {dirname, join} from "node:path"

/**
 * JSON has no comments, so the record explains itself with a `note` key.
 */
const RECORD_NOTE =
  "Managed by @qualcomm-ui/codemod to track applied migrations. Do not edit or remove."

interface MigrationRecord {
  completedMigrations?: unknown
  note?: string
}

function getRecord(
  packageJson: Record<string, unknown>,
): MigrationRecord | undefined {
  const record = packageJson.qui
  return record && typeof record === "object" && !Array.isArray(record)
    ? record
    : undefined
}

/**
 * The codemod names recorded in `qui.completedMigrations`. Entries that aren't
 * strings are ignored.
 */
function getRecordedCodemods(packageJson: Record<string, unknown>): string[] {
  const codemods = getRecord(packageJson)?.completedMigrations
  return Array.isArray(codemods)
    ? codemods.filter((name): name is string => typeof name === "string")
    : []
}

async function isRecordedIn(dir: string, name: string): Promise<boolean> {
  try {
    const content = await readFile(join(dir, "package.json"), "utf-8")
    return getRecordedCodemods(JSON.parse(content)).includes(name)
  } catch {
    // No package.json, or one that isn't valid JSON, in this directory.
    return false
  }
}

/**
 * Returns a function that resolves whether the codemod has run in a directory.
 * Results are cached per directory.
 *
 * A run from a directory migrates every file below it, so the codemod has run
 * in a directory when the package.json of the directory or of any of its
 * ancestors records it. Check each file's own directory rather than only the
 * project root: in a monorepo, the codemod may have run in one package
 * (`-d packages/app`) and from the root, in either order.
 */
export function createMigrationRecordLookup(
  name: string,
): (dir: string) => Promise<boolean> {
  const cache = new Map<string, Promise<boolean>>()
  const lookup = (dir: string): Promise<boolean> => {
    let result = cache.get(dir)
    if (!result) {
      const parent = dirname(dir)
      result = Promise.all([
        isRecordedIn(dir, name),
        parent === dir ? false : lookup(parent),
      ]).then(([own, inherited]) => own || inherited)
      cache.set(dir, result)
    }
    return result
  }
  return lookup
}

/**
 * Records in `qui.completedMigrations` of the package.json in `cwd` that the
 * codemod ran. Use this in codemods that can't tell from file content alone
 * whether a file is already migrated, and check
 * {@link createMigrationRecordLookup} before migrating each file.
 *
 * @returns the path to package.json.
 */
export async function addMigrationRecord(
  cwd: string,
  name: string,
): Promise<string> {
  const path = join(cwd, "package.json")
  const content = await readFile(path, "utf-8")
  const packageJson: Record<string, unknown> = JSON.parse(content)
  const codemods = getRecordedCodemods(packageJson)
  if (codemods.includes(name)) {
    return path
  }
  const record = getRecord(packageJson) ?? {}
  /**
   * Set before the spread so that the note comes first. An existing note keeps
   * its value.
   */
  packageJson.qui = {
    note: RECORD_NOTE,
    ...record,
    completedMigrations: [...codemods, name],
  }
  const indent = content.match(/^([ \t]+)"/m)?.[1] ?? "  "
  await writeFile(path, `${JSON.stringify(packageJson, null, indent)}\n`)
  return path
}
