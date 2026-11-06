// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Codemod, VersionBump} from "./types.js"

export interface StepPackage {
  bump: VersionBump
  /** The package's major version before this step runs. */
  current: number
}

export interface MigrationStep {
  codemod: Codemod
  /**
   * The packages that this step applies to, keyed by package name. Empty for
   * codemods included by `force`.
   */
  packages: Map<string, StepPackage>
}

export interface PlanMigrationOptions {
  /**
   * Include every codemod, even when none of its packages are detected at or
   * past the bump's `from` version.
   * @default false
   */
  force?: boolean
}

export interface MigrationPlan {
  /** Major version of each package after every step has run. */
  majors: Map<string, number>
  steps: MigrationStep[]
}

/**
 * Selects the codemods to run for the detected major versions. A codemod runs
 * when any of its packages is at or past the bump's `from` version, so it
 * applies both before and after the user upgrades. Codemods must therefore be
 * idempotent.
 *
 * Codemods are evaluated in order, and each applied codemod advances the
 * versions of the packages it bumps, so consecutive codemods (e.g. v2 → v3 and
 * v3 → v4) chain together in a single run.
 *
 * With `force`, every codemod runs. Only the packages detected at or past a
 * bump's `from` version are advanced.
 */
export function planMigration(
  codemods: Codemod[],
  detectedMajors: ReadonlyMap<string, number>,
  {force = false}: PlanMigrationOptions = {},
): MigrationPlan {
  const majors = new Map(detectedMajors)
  const steps: MigrationStep[] = []

  for (const codemod of codemods) {
    const packages = new Map<string, StepPackage>()
    for (const [name, bump] of Object.entries(codemod.versions)) {
      const current = majors.get(name)
      if (bump && current !== undefined && current >= bump.from) {
        packages.set(name, {bump, current})
      }
    }
    if (!packages.size && !force) {
      continue
    }
    for (const [name, {bump, current}] of packages) {
      majors.set(name, Math.max(current, bump.to))
    }
    steps.push({codemod, packages})
  }

  return {majors, steps}
}
