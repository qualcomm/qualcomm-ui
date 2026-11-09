// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {glob} from "glob"
import {readFile, writeFile} from "node:fs/promises"
import {dirname, join, relative} from "node:path"

import {MigrationCancelledError} from "../migration-cancelled-error.js"
import {
  addMigrationRecord,
  createMigrationRecordLookup,
} from "../migration-record.js"
import type {
  CodemodContext,
  CodemodFileResult,
  CodemodFileStatus,
} from "../types.js"

/**
 * Legacy spacing step to its replacement, matched by pixel value. Every
 * replacement is greater than or equal to its legacy step, and some legacy
 * steps are also valid replacements (e.g. the legacy `100` is 16px, the new
 * `100` is 4px).
 */
export const SPACING_RENAMES: Readonly<Record<string, string>> = {
  "0": "0",
  "10": "25",
  "20": "50",
  "30": "75",
  "40": "100",
  "50": "150",
  "60": "175",
  "70": "200",
  "80": "250",
  "90": "300",
  "100": "400",
  "110": "500",
  "120": "600",
  "130": "700",
  "140": "800",
  "150": "900",
  "160": "1000",
  "170": "1100",
  "180": "1200",
  "190": "1300",
  "200": "1400",
  "210": "1500",
  "220": "1600",
  "230": "1700",
  "240": "1800",
  "250": "1900",
  "260": "2000",
  "270": "2100",
  "280": "2200",
  "290": "2300",
  "300": "2400",
  "310": "2500",
  "320": "3000",
  "330": "3300",
}

/**
 * Every step of the new spacing scale.
 */
export const SPACING_STEPS: readonly string[] = [
  "0",
  "25",
  "50",
  "75",
  "100",
  "150",
  "175",
  "200",
  "250",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "1000",
  "1100",
  "1200",
  "1300",
  "1400",
  "1500",
  "1600",
  "1700",
  "1800",
  "1900",
  "2000",
  "2100",
  "2200",
  "2300",
  "2400",
  "2500",
  "3000",
  "3300",
]

/**
 * Legacy sizing step to its replacement, matched by pixel value.
 */
export const SIZING_RENAMES: Readonly<Record<string, string>> = {
  "10": "25",
  "20": "50",
  "30": "100",
  "40": "150",
  "50": "200",
  "60": "300",
  "70": "400",
  "80": "500",
  "90": "600",
  "100": "700",
  "110": "750",
  "120": "800",
  "125": "850",
  "130": "950",
  "140": "1000",
  "150": "1150",
  "160": "1200",
  "170": "1400",
  "180": "2000",
  "190": "3000",
  "200": "4000",
}

/**
 * Every step of the new sizing scale. `900` and `1100` have no legacy
 * equivalent.
 */
export const SIZING_STEPS: readonly string[] = [
  "25",
  "50",
  "100",
  "150",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "750",
  "800",
  "850",
  "900",
  "950",
  "1000",
  "1100",
  "1150",
  "1200",
  "1400",
  "2000",
  "3000",
  "4000",
]

/**
 * Legacy border radius name to its replacement, matched by pixel value.
 */
export const BORDER_RADIUS_RENAMES: Readonly<Record<string, string>> = {
  lg: "150",
  md: "100",
  none: "0",
  rounded: "max",
  sm: "75",
  xl: "200",
  xs: "50",
  xxl: "300",
}

/**
 * Every step of the new border radius scale.
 */
export const BORDER_RADIUS_STEPS: readonly string[] = [
  "0",
  "50",
  "75",
  "100",
  "150",
  "200",
  "300",
  "350",
  "400",
  "500",
  "600",
  "max",
]

export interface TokenScale {
  /** A substring that every token of the scale contains. */
  marker: string
  /** Shown in conflict messages, e.g. "spacing". */
  name: string
  /**
   * Matches a token of the scale. The first group captures the text before the
   * step, the second group captures the step. Must have the `g` flag.
   */
  pattern: RegExp
  /** Legacy step to its replacement. */
  renames: Readonly<Record<string, string>>
  /** Every step of the new scale. */
  steps: readonly string[]
}

/**
 * Matches `<prefix><step>`, but not inside a longer name such as
 * `--my-spacing-40` or `--spacing-100` when looking for `--spacing-10`.
 */
function cssVariablePattern(prefix: string): RegExp {
  return new RegExp(`(?<![\\w-])(${prefix})([a-z0-9]+)(?![\\w-])`, "g")
}

export const SPACING_SCALE: TokenScale = {
  marker: "--spacing-",
  name: "spacing",
  pattern: cssVariablePattern("--spacing-"),
  renames: SPACING_RENAMES,
  steps: SPACING_STEPS,
}

export const SIZING_SCALE: TokenScale = {
  marker: "--sizing-",
  name: "sizing",
  pattern: cssVariablePattern("--sizing-"),
  renames: SIZING_RENAMES,
  steps: SIZING_STEPS,
}

export const BORDER_RADIUS_SCALE: TokenScale = {
  marker: "--border-radius-",
  name: "border radius",
  pattern: cssVariablePattern("--border-radius-"),
  renames: BORDER_RADIUS_RENAMES,
  steps: BORDER_RADIUS_STEPS,
}

/**
 * Tailwind spacing utilities (`p-qds-40`, `-mt-qds-40`, `md:gap-x-qds-40`) and
 * their theme variables (`--spacing-qds-40`).
 */
export const TAILWIND_SPACING_SCALE: TokenScale = {
  marker: "-qds-",
  name: "Tailwind spacing",
  pattern: /(?<=[A-Za-z0-9])(-qds-)([0-9]+)(?![\w-])/g,
  renames: SPACING_RENAMES,
  steps: SPACING_STEPS,
}

/**
 * How to treat steps that exist in both the legacy and the new scale, in files
 * that don't contain any step unique to either scale:
 *
 * - `convert`: the file is legacy, rename the steps.
 * - `keep`: the file is already migrated, leave the steps alone.
 */
export type AmbiguousMode = "convert" | "keep"

export interface MigrateScalesOptions {
  /**
   * A single mode for every scale, or a mode per scale name.
   * @default "convert"
   */
  ambiguous?: AmbiguousMode | Readonly<Partial<Record<string, AmbiguousMode>>>
}

export interface ScaleMigrationResult {
  content: string
  /** Tokens the codemod can't rename safely, one entry per scale. */
  manual: string[]
  /** Number of tokens renamed. */
  renamed: number
  /**
   * - `updated`: tokens were renamed.
   * - `unchanged`: the file has tokens of the scales, but none to rename.
   * - `skipped`: the file has no tokens of the scales.
   * - `conflict`: some tokens must be renamed manually. Tokens of other scales
   *   may still have been renamed.
   */
  status: CodemodFileStatus
}

interface ScaleUsage {
  /** Steps that exist in both scales, e.g. spacing `100`. */
  ambiguous: Set<string>
  /** Steps that only exist in the legacy scale, e.g. spacing `40`. */
  legacy: Set<string>
  /** Steps that only exist in the new scale, e.g. spacing `25`. */
  migrated: Set<string>
}

function getScaleUsage(content: string, scale: TokenScale): ScaleUsage {
  const usage: ScaleUsage = {
    ambiguous: new Set(),
    legacy: new Set(),
    migrated: new Set(),
  }
  if (!content.includes(scale.marker)) {
    return usage
  }
  for (const [, , step] of content.matchAll(scale.pattern)) {
    const isLegacy = Object.hasOwn(scale.renames, step)
    const isNew = scale.steps.includes(step)
    if (isLegacy && isNew) {
      usage.ambiguous.add(step)
    } else if (isLegacy) {
      usage.legacy.add(step)
    } else if (isNew) {
      usage.migrated.add(step)
    }
  }
  return usage
}

function hasTokens(usage: ScaleUsage): boolean {
  return usage.ambiguous.size + usage.legacy.size + usage.migrated.size > 0
}

function resolveMode(
  scale: TokenScale,
  ambiguous: MigrateScalesOptions["ambiguous"] = "convert",
): AmbiguousMode {
  return typeof ambiguous === "string"
    ? ambiguous
    : (ambiguous[scale.name] ?? "convert")
}

/**
 * Lists the legacy tokens of a scale with their replacements, for manual
 * updates.
 */
function describeLegacyTokens(content: string, scale: TokenScale): string {
  const pairs = new Map<string, string>()
  for (const [token, prefix, step] of content.matchAll(scale.pattern)) {
    if (Object.hasOwn(scale.renames, step)) {
      pairs.set(token, `${token} → ${prefix}${scale.renames[step]}`)
    }
  }
  return Array.from(pairs.values()).join(", ")
}

/**
 * Renames the legacy tokens of each scale in a single pass, so that a renamed
 * token is never renamed again (e.g. `--spacing-40` becomes `--spacing-100`,
 * never `--spacing-400`).
 *
 * Steps unique to the legacy scale are always renamed. Steps that exist in both
 * scales are renamed when the file also has steps unique to the legacy scale,
 * kept when it has steps unique to the new scale, and follow `ambiguous` when
 * it has neither. Files that have steps unique to both scales are reported for
 * a manual update if they also have ambiguous steps.
 */
export function migrateScales(
  content: string,
  scales: readonly TokenScale[],
  {ambiguous}: MigrateScalesOptions = {},
): ScaleMigrationResult {
  const manual: string[] = []
  let found = false
  let renamed = 0
  let result = content

  for (const scale of scales) {
    const usage = getScaleUsage(result, scale)
    if (!hasTokens(usage)) {
      continue
    }
    found = true

    const legacy = usage.legacy.size > 0
    const migrated = usage.migrated.size > 0
    if (legacy && migrated && usage.ambiguous.size) {
      manual.push(
        `the ${scale.name} tokens mix legacy and new steps, rename any legacy tokens: ${describeLegacyTokens(result, scale)}`,
      )
      continue
    }

    const convertAmbiguous = legacy
      ? !migrated
      : !migrated && resolveMode(scale, ambiguous) === "convert"

    result = result.replace(
      scale.pattern,
      (token, prefix: string, step: string) => {
        if (!Object.hasOwn(scale.renames, step)) {
          return token
        }
        if (usage.ambiguous.has(step) && !convertAmbiguous) {
          return token
        }
        const replacement = scale.renames[step]
        if (replacement !== step) {
          renamed++
        }
        return `${prefix}${replacement}`
      },
    )
  }

  const status: CodemodFileStatus = manual.length
    ? "conflict"
    : renamed
      ? "updated"
      : found
        ? "unchanged"
        : "skipped"

  return {content: result, manual, renamed, status}
}

function describeResult(
  {manual, renamed, status}: ScaleMigrationResult,
  dryRun: boolean,
): string {
  const tokens = `${renamed} token${renamed === 1 ? "" : "s"}`
  const verb = dryRun ? "would rename" : "renamed"
  switch (status) {
    case "updated":
      return `${verb} ${tokens}`
    case "unchanged":
      return "no legacy tokens found"
    case "skipped":
      return "no tokens found, ignored"
    case "conflict":
      return `${renamed ? `${verb} ${tokens}, ` : ""}update manually: ${manual.join("; ")}`
  }
}

const SOURCE_FILES =
  "**/*.{css,scss,sass,less,pcss,html,ts,tsx,mts,cts,js,jsx,mjs,cjs,vue,svelte,md,mdx}"

const IGNORED_FILES = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/.angular/**",
  "**/.react-router/**",
  "**/CHANGELOG.md",
]

interface SourceFile {
  content: string
  file: string
  /** Whether a package.json that applies to the file records the codemod. */
  recorded: boolean
}

/**
 * A project is migrated by hand when it uses steps unique to the new scale and
 * none unique to the legacy scale. Its ambiguous steps are already migrated.
 */
function isMigratedProject(
  sources: readonly SourceFile[],
  scale: TokenScale,
): boolean {
  let migrated = false
  for (const {content} of sources) {
    const usage = getScaleUsage(content, scale)
    if (usage.legacy.size) {
      return false
    }
    migrated ||= usage.migrated.size > 0
  }
  return migrated
}

/**
 * Lists the tokens of a scale whose step only exists in the new scale, e.g.
 * `--spacing-25` or `md:p-qds-1000`.
 */
function findMigratedTokens(content: string, scale: TokenScale): string[] {
  const tokens = new Set<string>()
  for (const match of content.matchAll(scale.pattern)) {
    const [token, , step] = match
    if (!Object.hasOwn(scale.renames, step) && scale.steps.includes(step)) {
      // Tailwind matches start at `-qds-`, so prepend the utility and variants.
      const utility = /[\w:-]*$/.exec(content.slice(0, match.index))![0]
      tokens.add(`${utility}${token}`)
    }
  }
  return Array.from(tokens)
}

const MAX_LISTED_FILES = 10

function describeMigratedFiles(
  cwd: string,
  files: readonly {file: string; tokens: string[]}[],
): string {
  const listed = files
    .slice(0, MAX_LISTED_FILES)
    .map(({file, tokens}) => `  ${relative(cwd, file)}: ${tokens.join(", ")}`)
  if (files.length > MAX_LISTED_FILES) {
    listed.push(`  and ${files.length - MAX_LISTED_FILES} more files`)
  }
  return `found tokens that only exist in the @qualcomm-ui/qds-core v2 scale, so the project looks already migrated. No files were changed.

${listed.join("\n")}

Some legacy and v2 steps share a name but not a pixel value (the legacy --spacing-100 is 16px, the v2 --spacing-100 is 4px). Running this migration on migrated files can rename tokens that are already correct.

If the project still has legacy tokens to rename, run again with --force. Files that use v2-only steps then keep their shared steps, and files that mix legacy, v2-only, and shared steps are reported for a manual update.`
}

/**
 * Renames the legacy tokens of each scale in every source file of the project.
 *
 * Renaming isn't idempotent (the legacy `--spacing-40` becomes `--spacing-100`,
 * which is also a legacy step), so the codemod records its name in
 * package.json. Ambiguous steps are kept in files covered by a record, and in
 * projects migrated by hand. They're renamed otherwise.
 *
 * These codemods are never revised: a recorded name means the file is
 * migrated.
 *
 * Unless `force` is set, the migration is cancelled when any file uses steps
 * unique to the new scale, since the project was likely started on the new
 * scale or already migrated.
 */
export async function runScaleCodemod(
  {cwd, dryRun, force}: CodemodContext,
  name: string,
  scales: readonly TokenScale[],
): Promise<CodemodFileResult[]> {
  const files = await glob(SOURCE_FILES, {
    absolute: true,
    cwd,
    ignore: IGNORED_FILES,
    nodir: true,
  })
  const isRecorded = createMigrationRecordLookup(name)

  const sources: SourceFile[] = []
  for (const file of files.sort()) {
    const content = await readFile(file, "utf-8")
    if (scales.some((scale) => content.includes(scale.marker))) {
      sources.push({
        content,
        file,
        recorded: await isRecorded(dirname(file)),
      })
    }
  }

  if (!force) {
    const migrated = sources.flatMap(({content, file}) => {
      const tokens = scales.flatMap((scale) =>
        findMigratedTokens(content, scale),
      )
      return tokens.length ? [{file, tokens}] : []
    })
    if (migrated.length) {
      throw new MigrationCancelledError(describeMigratedFiles(cwd, migrated))
    }
  }
  const unrecorded = sources.filter((source) => !source.recorded)
  const ambiguous: Record<string, AmbiguousMode> = {}
  for (const scale of scales) {
    ambiguous[scale.name] = isMigratedProject(unrecorded, scale)
      ? "keep"
      : "convert"
  }

  const results: CodemodFileResult[] = []
  let renamed = false
  for (const {content, file, recorded} of sources) {
    const result = migrateScales(content, scales, {
      ambiguous: recorded ? "keep" : ambiguous,
    })
    if (result.content !== content) {
      renamed = true
      if (!dryRun) {
        await writeFile(file, result.content, "utf-8")
      }
    }
    results.push({
      file,
      message: describeResult(result, dryRun),
      status: result.status,
    })
  }

  if (renamed && !(await isRecorded(cwd))) {
    results.push({
      file: dryRun
        ? join(cwd, "package.json")
        : await addMigrationRecord(cwd, name),
      message: `${dryRun ? "would record" : "recorded"} ${name} in qui.completedMigrations, so that running the codemod again doesn't rename the new tokens`,
      status: "updated",
    })
  }
  return results
}
