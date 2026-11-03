// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import {existsSync, readFileSync, writeFileSync} from "node:fs"
import {join, relative, resolve} from "node:path"

import {
  bumpRange,
  detectPackageVersions,
  type DetectedPackage,
  type PackageJson,
  readPackageJson,
} from "./detect-versions.js"
import {type MigrationPlan, planMigration, type StepPackage} from "./plan.js"
import type {CodemodFileResult, MigrationGroup} from "./types.js"

export interface RunMigrationOptions {
  /** The project root containing package.json. */
  dir: string
  /**
   * Preview changes without writing files.
   * @default false
   */
  dryRun?: boolean
  /**
   * @default "info"
   */
  logMode?: "info" | "verbose"
}

interface Tally {
  manual: number
  updated: number
}

const ICONS = {
  manual: chalk.yellow("⚠"),
  unchanged: chalk.dim("-"),
  updated: chalk.green("✔"),
} as const

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}

function formatAppliesTo(packages: Map<string, StepPackage>): string {
  return Array.from(packages)
    .map(
      ([name, {bump, current}]) =>
        `${chalk.cyan(name)} v${bump.from} to v${bump.to} ${chalk.dim(`(detected v${current})`)}`,
    )
    .join(", ")
}

function logFileResults(
  results: CodemodFileResult[],
  noMatchMessage: string,
  cwd: string,
  verbose: boolean,
  tally: Tally,
): void {
  const relevant = results.filter((result) => result.status !== "skipped")
  if (!relevant.length) {
    console.log(`  ${ICONS.unchanged} ${chalk.dim(noMatchMessage)}`)
  }
  for (const {file, message, status} of verbose ? results : relevant) {
    const path = relative(cwd, file)
    if (status === "updated") {
      tally.updated++
      console.log(`  ${ICONS.updated} ${path}: ${chalk.green(message)}`)
    } else if (status === "conflict") {
      tally.manual++
      console.warn(`  ${ICONS.manual} ${path}: ${chalk.yellow(message)}`)
    } else {
      console.log(`  ${ICONS.unchanged} ${path}: ${chalk.dim(message)}`)
    }
  }
}

/**
 * Updates the package.json ranges of the packages targeted by the migration,
 * and logs the outcome for each one.
 */
function updateDependencies(
  path: string,
  packageJson: PackageJson,
  detected: Map<string, DetectedPackage>,
  plan: MigrationPlan,
  dryRun: boolean,
  tally: Tally,
): void {
  const targeted = new Set(
    plan.steps.flatMap((step) => [...step.packages.keys()]),
  )
  let changed = false

  for (const name of targeted) {
    const {declared, major} = detected.get(name)!
    const target = plan.majors.get(name)!
    const current = declared ? `"${declared.range}"` : "not in package.json"

    if (major >= target) {
      console.log(
        `  ${ICONS.unchanged} ${name}: ${chalk.dim(`already on v${major} (${current}), no changes needed`)}`,
      )
      continue
    }
    if (declared?.range.startsWith("workspace:")) {
      console.log(
        `  ${ICONS.unchanged} ${name}: ${chalk.dim(`not changed, ${current} uses the local workspace package`)}`,
      )
      continue
    }
    const range = declared && bumpRange(declared.range, target)
    if (!declared || !range) {
      tally.manual++
      console.warn(
        `  ${ICONS.manual} ${name}: ${chalk.yellow(`update to v${target} manually, ${declared ? `${current} can't be updated automatically` : "it isn't listed in package.json"}`)}`,
      )
      continue
    }

    packageJson[declared.field]![name] = range
    changed = true
    tally.updated++
    console.log(
      `  ${ICONS.updated} ${name}: ${chalk.green(`${dryRun ? "would update" : "updated"} "${declared.range}" to "${range}"`)}`,
    )
  }

  if (changed && !dryRun) {
    const content = readFileSync(path, "utf-8")
    const indent = content.match(/^([ \t]+)"/m)?.[1] ?? "  "
    writeFileSync(path, `${JSON.stringify(packageJson, null, indent)}\n`)
  }
}

function logSummary(
  tally: Tally,
  bumpedDependencies: boolean,
  dryRun: boolean,
): void {
  const manual = tally.manual
    ? chalk.yellow(
        `${plural(tally.manual, "item")} need${tally.manual === 1 ? "s" : ""} a manual update (marked ⚠ above).`,
      )
    : ""

  if (!tally.updated) {
    console.log(
      manual
        ? `\n${chalk.bold("No changes made.")} ${manual}`
        : `\n${chalk.bold.green("No changes, already up to date.")}`,
    )
    return
  }

  const parts = [
    chalk.bold.green(
      `${plural(tally.updated, "change")} ${dryRun ? "would be applied" : "applied"}.`,
    ),
  ]
  if (manual) {
    parts.push(manual)
  }
  if (dryRun) {
    parts.push(chalk.yellow("Dry run: no files were modified."))
  } else if (bumpedDependencies) {
    parts.push("Reinstall dependencies to apply the updated versions.")
  }
  console.log(`\n${parts.join(" ")}`)
}

export async function runMigration(
  group: MigrationGroup,
  options: RunMigrationOptions,
): Promise<void> {
  const cwd = resolve(options.dir)
  const dryRun = options.dryRun ?? false
  const verbose = options.logMode === "verbose"
  const packageJsonPath = join(cwd, "package.json")

  if (!existsSync(packageJsonPath)) {
    console.error(chalk.red(`No package.json found in ${cwd}`))
    process.exitCode = 1
    return
  }

  if (dryRun) {
    console.log(chalk.yellow("Dry run: no files will be modified.\n"))
  }

  const packageJson = readPackageJson(packageJsonPath)
  const detected = detectPackageVersions(cwd, packageJson, group.packages)

  console.log(chalk.bold("Detected versions:"))
  const nameWidth = Math.max(...group.packages.map((name) => name.length))
  for (const name of group.packages) {
    const pkg = detected.get(name)
    console.log(
      `  ${name.padEnd(nameWidth)}  ${pkg ? chalk.cyan(`v${pkg.major}`) : chalk.dim("not installed")}`,
    )
  }

  const plan = planMigration(
    group.codemods,
    new Map(Array.from(detected, ([name, {major}]) => [name, major])),
  )

  if (!plan.steps.length) {
    console.log(
      `\n${chalk.bold.green("No changes,")} ${chalk.dim("no codemods apply to the detected versions.")}`,
    )
    return
  }

  const tally: Tally = {manual: 0, updated: 0}

  for (const [index, {codemod, packages}] of plan.steps.entries()) {
    console.log(
      `\n${chalk.dim(`[${index + 1}/${plan.steps.length}]`)} ${chalk.bold(codemod.title)}`,
    )
    console.log(`  ${chalk.dim("for")} ${formatAppliesTo(packages)}`)
    logFileResults(
      await codemod.run({cwd, dryRun}),
      codemod.noMatchMessage,
      cwd,
      verbose,
      tally,
    )
  }

  console.log(`\n${chalk.bold("Dependencies:")}`)
  const filesUpdated = tally.updated
  updateDependencies(
    packageJsonPath,
    packageJson,
    detected,
    plan,
    dryRun,
    tally,
  )

  logSummary(tally, tally.updated > filesUpdated, dryRun)
}
