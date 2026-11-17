// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isEqual} from "@qualcomm-ui/utils/equal"
import type {ValueOrFn} from "@qualcomm-ui/utils/machine"

import type {
  DateFilterDefinition,
  DateFilterValue,
  FilterDefinition,
  FilterDefinitions,
  RangeFilterDefinition,
  RangeFilterValue,
} from "../filter-panel.definitions.js"
import type {
  FilterPanelApiProps,
  FilterPanelOptionLabels,
  FilterPanelValues,
} from "../filter-panel.types.js"

export type IsEmptyFilterValue = (id: string, value: unknown) => boolean

function isBlankValue(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  )
}

function isUnbounded(bounds: unknown): boolean {
  return (
    Array.isArray(bounds) &&
    bounds.every((bound) => bound === null || bound === undefined)
  )
}

function isEmptyForDefinition(
  definition: FilterDefinition,
  value: unknown,
): boolean {
  switch (definition.kind) {
    case "custom":
      return !!definition.isEmptyValue?.(value)
    case "date": {
      const dateValue = value as DateFilterValue
      return "range" in dateValue
        ? isUnbounded(dateValue.range)
        : !dateValue.preset
    }
    case "range":
      return isUnbounded(value)
    default:
      return false
  }
}

/**
 * Builds the empty-value check for a panel. A value is empty when it carries no
 * filtering intent (`undefined`, `null`, `""`, `[]`), when its definition
 * considers it empty (an unbounded range, for example), or when the consumer's
 * `isEmptyValue` rejects it. Empty values are never counted or committed.
 */
export function createEmptyValueCheck(
  definitions: FilterDefinitions | undefined,
  isEmptyValue: FilterPanelApiProps["isEmptyValue"],
): IsEmptyFilterValue {
  return (id, value) => {
    if (isBlankValue(value)) {
      return true
    }
    const definition = definitions?.[id]
    if (definition && isEmptyForDefinition(definition, value)) {
      return true
    }
    return !!isEmptyValue?.(id, value)
  }
}

/**
 * Writes a filter value. Empty values delete the filter's key.
 */
export function setFilterValue(
  isEmpty: IsEmptyFilterValue,
  values: FilterPanelValues,
  id: string,
  updater: ValueOrFn<unknown>,
): FilterPanelValues {
  const value =
    typeof updater === "function"
      ? (updater as (prev: unknown) => unknown)(values[id])
      : updater

  const {[id]: _removed, ...rest} = values
  return isEmpty(id, value) ? rest : {...values, [id]: value}
}

export function getNonEmptyValues(
  isEmpty: IsEmptyFilterValue,
  values: FilterPanelValues,
): FilterPanelValues {
  return Object.fromEntries(
    Object.entries(values).filter(([id, value]) => !isEmpty(id, value)),
  )
}

/**
 * Compares filter values by key, ignoring key order and empty values.
 */
export function areValuesEqual(
  isEmpty: IsEmptyFilterValue,
  a: FilterPanelValues,
  b: FilterPanelValues,
): boolean {
  const left = getNonEmptyValues(isEmpty, a)
  const right = getNonEmptyValues(isEmpty, b)
  const keys = Object.keys(left)
  if (keys.length !== Object.keys(right).length) {
    return false
  }
  return keys.every((key) => key in right && isEqual(left[key], right[key]))
}

/**
 * Serializes values with sorted keys, so that the same filters in a different
 * key order produce the same hash.
 */
export function hashValues(values: FilterPanelValues | undefined): string {
  if (!values) {
    return ""
  }
  return JSON.stringify(
    Object.keys(values)
      .sort()
      .map((key) => [key, values[key]]),
  )
}

/**
 * The number of values a non-empty filter contributes to the active filter
 * count: the array length for arrays, otherwise 1.
 */
export function getValueCount(
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

export function countValues(
  definitions: FilterDefinitions | undefined,
  isEmpty: IsEmptyFilterValue,
  values: FilterPanelValues,
): number {
  return Object.entries(getNonEmptyValues(isEmpty, values)).reduce(
    (count, [id, value]) => count + getValueCount(definitions?.[id], value),
    0,
  )
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
export function getValueLabels(
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

/**
 * Merges labels recorded from a user selection.
 */
export function recordOptionLabels(
  labels: FilterPanelOptionLabels,
  id: string,
  selected: Record<string, string>,
): FilterPanelOptionLabels {
  if (!Object.keys(selected).length) {
    return labels
  }
  return {...labels, [id]: {...labels[id], ...selected}}
}

/**
 * Returns the recorded labels of the values that are currently selected.
 */
export function pickOptionLabels(
  labels: FilterPanelOptionLabels,
  values: FilterPanelValues,
): FilterPanelOptionLabels {
  const picked: FilterPanelOptionLabels = {}
  for (const [id, value] of Object.entries(values)) {
    const recorded = labels[id]
    if (!recorded || !Array.isArray(value)) {
      continue
    }
    const selected = Object.fromEntries(
      value
        .map(String)
        .filter((option) => option in recorded)
        .map((option) => [option, recorded[option]]),
    )
    if (Object.keys(selected).length) {
      picked[id] = selected
    }
  }
  return picked
}
