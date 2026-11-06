// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {CodemodFileStatus} from "../types.js"

import type {Edit, ExportRenames} from "./source-edits.js"

export type EmphasisComponent =
  | "breadcrumbs"
  | "progress"
  | "progress-ring"
  | "segmented-control"
  | "slider"
  | "tag"

interface ComponentRenames {
  /** Deprecated prop replaced by `emphasis`. */
  prop?: string
  /** Deprecated `emphasis` values and their replacements. */
  values: Readonly<Record<string, string>>
}

const PRIMARY_TO_BRAND = {primary: "brand"}

export const EMPHASIS_RENAMES: Readonly<
  Record<EmphasisComponent, ComponentRenames>
> = {
  breadcrumbs: {values: PRIMARY_TO_BRAND},
  progress: {values: PRIMARY_TO_BRAND},
  "progress-ring": {values: PRIMARY_TO_BRAND},
  "segmented-control": {prop: "variant", values: PRIMARY_TO_BRAND},
  slider: {prop: "variant", values: PRIMARY_TO_BRAND},
  tag: {
    values: {
      kiwi: "lime",
      "outline-brand": "brand-outline",
      "outline-neutral": "neutral-outline",
    },
  },
}

export const EMPHASIS_TYPE_RENAMES: ExportRenames = {
  "@qualcomm-ui/qds-core/segmented-control": {
    QdsSegmentedControlVariant: "QdsSegmentedControlEmphasis",
  },
  "@qualcomm-ui/qds-core/slider": {QdsSliderVariant: "QdsSliderEmphasis"},
}

export interface EmphasisPropsResult {
  content: string
  /** Usages the codemod can't rewrite safely. */
  manual: string[]
  /** Number of deprecated props, values, and type names replaced. */
  replaced: number
  /**
   * - `updated`: deprecated usages were replaced.
   * - `unchanged`: the file uses an affected component or type module, but
   *   doesn't use a deprecated prop, value, or type name.
   * - `skipped`: the file doesn't use an affected component or type module.
   * - `conflict`: some usages must be updated manually. Other usages in the
   *   file may still have been updated.
   */
  status: CodemodFileStatus
}

export interface StringLiteralRange {
  /** End offset of the literal's text, excluding the closing quote. */
  end: number
  /** Start offset of the literal's text, excluding the opening quote. */
  start: number
  /** The literal's text as written in the source. */
  value: string
}

export interface PropUsage {
  name: string
  nameEnd: number
  nameStart: number
  /**
   * String literals that the prop's value can evaluate to, e.g. both branches
   * of a conditional. Empty for other expressions, which are only renamed.
   */
  values: StringLiteralRange[]
}

/**
 * Replaces the deprecated props and values of a single element. If the element
 * sets both the deprecated prop and `emphasis`, it's reported for a manual
 * update and left unchanged. Returns the number of props replaced or updated.
 *
 * @param describeElement e.g. `<Slider> on line 12`, used in manual update
 * messages.
 */
export function replaceEmphasisProps(
  component: EmphasisComponent,
  props: PropUsage[],
  describeElement: () => string,
  edits: Edit[],
  manual: string[],
): number {
  const {prop: deprecatedProp, values} = EMPHASIS_RENAMES[component]
  const deprecated = props.filter((prop) => prop.name === deprecatedProp)
  const emphasis = props.filter((prop) => prop.name === "emphasis")

  if (deprecated.length && emphasis.length) {
    manual.push(
      `remove ${deprecatedProp} from ${describeElement()}, emphasis takes precedence`,
    )
    return 0
  }

  let replaced = 0
  for (const prop of [...deprecated, ...emphasis]) {
    let changed = prop.name !== "emphasis"
    if (changed) {
      edits.push({end: prop.nameEnd, start: prop.nameStart, text: "emphasis"})
    }
    for (const {end, start, value} of prop.values) {
      if (Object.hasOwn(values, value)) {
        edits.push({end, start, text: values[value]})
        changed = true
      }
    }
    if (changed) {
      replaced++
    }
  }
  return replaced
}

export function getEmphasisStatus(
  replaced: number,
  manual: string[],
): CodemodFileStatus {
  return manual.length ? "conflict" : replaced ? "updated" : "unchanged"
}

export function describeEmphasisResult(
  {manual, replaced, status}: EmphasisPropsResult,
  dryRun: boolean,
  skippedMessage: string,
): string {
  const usages = `${replaced} deprecated ${replaced === 1 ? "prop, value, or type name" : "props, values, or type names"}`
  const verb = dryRun ? "would replace" : "replaced"
  switch (status) {
    case "updated":
      return `${verb} ${usages}`
    case "unchanged":
      return "no deprecated emphasis props, values, or type names found"
    case "skipped":
      return skippedMessage
    case "conflict":
      return `${replaced ? `${verb} ${usages}, ` : ""}update manually: ${manual.join("; ")}`
  }
}
