// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  DateFilterDefinition,
  DateFilterValue,
  FilterDefinition,
  RangeFilterDefinition,
  RangeFilterValue,
} from "./filters.definitions.js"

function isBlank(value: unknown): boolean {
  return value === undefined || value === null || value === ""
}

function isUnbounded(bounds: unknown): boolean {
  return !Array.isArray(bounds) || bounds.every(isBlank)
}

/**
 * Whether a date filter value has neither a preset nor a bound.
 */
export function isEmptyDateFilterValue(value: unknown): boolean {
  if (typeof value !== "object" || value === null) {
    return true
  }
  return "range" in value
    ? isUnbounded(value.range)
    : !(value as {preset?: string}).preset
}

/**
 * Whether a value carries no filtering intent. Blank values (`undefined`,
 * `null`, `""`, `[]`) are always empty. Otherwise the definition decides, so
 * an unbounded range or date is empty, and custom definitions use their own
 * `isEmptyValue`.
 */
export function isEmptyFilterValue(
  definition: FilterDefinition | undefined,
  value: unknown,
): boolean {
  if (isBlank(value) || (Array.isArray(value) && value.length === 0)) {
    return true
  }
  switch (definition?.kind) {
    case "custom":
      return !!definition.isEmptyValue?.(value)
    case "date":
      return isEmptyDateFilterValue(value)
    case "range":
      return isUnbounded(value)
    default:
      return false
  }
}

/**
 * The number of values a non-empty filter contributes to an active filter
 * count: the array length for arrays, otherwise 1.
 */
export function countFilterValue(
  definition: FilterDefinition | undefined,
  value: unknown,
): number {
  if (definition?.kind === "custom" && definition.getValueCount) {
    return definition.getValueCount(value)
  }
  if (definition?.kind === "range" || definition?.kind === "date") {
    return 1
  }
  return Array.isArray(value) ? value.length : 1
}

export function stringifyFilterValue(value: unknown): string {
  return typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
    ? String(value)
    : ""
}

function formatBounds(
  start: string | null,
  end: string | null,
): string | undefined {
  if (start !== null && end !== null) {
    return `${start} – ${end}`
  }
  if (start !== null) {
    return `≥ ${start}`
  }
  if (end !== null) {
    return `≤ ${end}`
  }
  return undefined
}

function formatRangeValue(
  definition: RangeFilterDefinition | undefined,
  value: RangeFilterValue,
): string | undefined {
  const format = definition?.formatValue ?? String
  const [min, max] = value
  return formatBounds(
    min === null || min === undefined ? null : format(min),
    max === null || max === undefined ? null : format(max),
  )
}

function formatDateValue(
  definition: DateFilterDefinition | undefined,
  value: DateFilterValue,
): string | undefined {
  if ("preset" in value) {
    return (
      definition?.presets?.find((preset) => preset.value === value.preset)
        ?.label ?? value.preset
    )
  }
  const format = definition?.formatDate ?? ((date: string) => date)
  const [start, end] = value.range
  return formatBounds(start ? format(start) : null, end ? format(end) : null)
}

/**
 * Returns the labels that summarize a non-empty filter value, such as one
 * label per active filter chip.
 */
export function labelFilterValue(
  definition: FilterDefinition | undefined,
  value: unknown,
  getOptionLabel: (option: string) => string,
): string[] {
  switch (definition?.kind) {
    case "custom":
      if (definition.getValueLabels) {
        return definition.getValueLabels(value)
      }
      break
    case "date": {
      const label = formatDateValue(definition, value as DateFilterValue)
      return label ? [label] : []
    }
    case "range": {
      const label = formatRangeValue(definition, value as RangeFilterValue)
      return label ? [label] : []
    }
    case "text":
      return [String(value)]
  }
  return Array.isArray(value)
    ? value.map((option) => getOptionLabel(String(option)))
    : [getOptionLabel(stringifyFilterValue(value))]
}
