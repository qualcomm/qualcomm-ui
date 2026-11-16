// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  JSX,
  MachineSchema,
  ValueOrFn,
} from "@qualcomm-ui/utils/machine"

import type {filterPanelAnatomy} from "./filter-panel.anatomy.js"

/**
 * - `manual`: changes are staged in a draft and committed when applied.
 * - `auto`: changes are committed immediately.
 */
export type FilterPanelApplyMode = "auto" | "manual"

/**
 * The kind of filter control that produced a value. Determines the value's
 * shape and, for tables, the built-in filter function used when the column does
 * not define its own.
 *
 * - `checkbox`, `checkboxTree`, `combobox`: `string[]`
 * - `radio`, `select`: `string`
 * - `range`: `[number | null, number | null]`, where `null` is unbounded
 * - `date`: `{preset: string}` or `{range: [string | null, string | null]}`
 *   with ISO 8601 dates
 * - `text`: `{query: string, wholeWord?: boolean}`
 */
export type FilterPanelFilterType =
  | "checkbox"
  | "checkboxTree"
  | "combobox"
  | "date"
  | "radio"
  | "range"
  | "select"
  | "text"

export interface FilterPanelFilter {
  /**
   * The filter id.
   */
  id: string

  /**
   * The kind of filter control that produced the value. Set by the filter
   * control when it writes a value, and preserved when a later write omits it.
   */
  type?: FilterPanelFilterType | undefined

  /**
   * The filter value. Its shape is defined by the filter control and
   * interpreted by whatever consumes the committed filters.
   */
  value: unknown
}

/**
 * The filters managed by the panel. Structurally compatible with the table's
 * `ColumnFiltersState`.
 */
export type FilterPanelValue = FilterPanelFilter[]

export interface FilterPanelApiProps {
  /**
   * Controls when filter changes are committed.
   *
   * @default "manual"
   */
  applyMode?: FilterPanelApplyMode | undefined

  /**
   * The initial committed filters. Use when you don't need to control the
   * committed filters.
   *
   * @default []
   */
  defaultValue?: FilterPanelValue | undefined

  /**
   * Resolves the human-readable label for a filter. Return `undefined` to fall
   * back to the filter id.
   */
  getFilterLabel?: ((id: string) => string | undefined) | undefined

  /**
   * Resolves the human-readable label for a filter value. Return `undefined`
   * to fall back to `String(value)` for primitive values.
   */
  getFilterOptionLabel?:
    | ((id: string, value: unknown) => string | undefined)
    | undefined

  /**
   * Additional check for empty filter values, applied after the built-in check
   * for `undefined`, `null`, `""`, and `[]`. Empty values remove the filter.
   */
  isEmptyValue?: ((filter: FilterPanelFilter) => boolean) | undefined

  /**
   * Called when the committed filters change: on apply in `manual` mode, on
   * every change in `auto` mode.
   */
  onValueChange?: ((value: FilterPanelValue) => void) | undefined

  /**
   * The controlled committed filters.
   */
  value?: FilterPanelValue | undefined
}

export interface FilterPanelSchema extends MachineSchema {
  actions: ActionSchema<
    | "applyDraft"
    | "clearFilters"
    | "resetDraft"
    | "setFilterValue"
    | "syncDraft"
  >
  computed: {
    /**
     * The filters the panel currently displays: the draft in `manual` mode, the
     * committed filters in `auto` mode.
     */
    filters: FilterPanelValue
  }
  context: {
    draft: FilterPanelValue
    value: FilterPanelValue
  }
  events:
    | {type: "APPLY"}
    | {type: "CLEAR_ALL"}
    | {type: "RESET"}
    | {
        filterType?: FilterPanelFilterType | undefined
        id: string
        type: "FILTER.SET"
        value: ValueOrFn<unknown>
      }
  guards: {
    isAutoApply: () => boolean
  }
  props: RequiredBy<FilterPanelApiProps, "applyMode" | "defaultValue">
  refs: {
    /**
     * The committed filters as of the last sync. Used to decide whether the
     * draft has diverged from them.
     */
    appliedFilters: FilterPanelValue
  }
  state: "idle"
}

type PartName = AnatomyPartName<typeof filterPanelAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"filter-panel", P> {}

export interface FilterPanelRootBindings extends Part<"root"> {
  "data-apply-mode": FilterPanelApplyMode
  "data-dirty": BooleanDataAttr
}

export interface FilterPanelApplyTriggerBindings extends Part<"applyTrigger"> {
  "data-disabled": BooleanDataAttr
  disabled: boolean
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface FilterPanelClearTriggerBindings extends Part<"clearTrigger"> {
  "data-disabled": BooleanDataAttr
  disabled: boolean
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface FilterPanelApi {
  /**
   * Commits the draft. No-op in `auto` mode.
   */
  apply: () => void

  /**
   * Controls when filter changes are committed.
   */
  applyMode: FilterPanelApplyMode

  /**
   * Removes every filter. In `manual` mode this clears the draft and must be
   * applied; in `auto` mode it clears the committed filters immediately.
   */
  clearAll: () => void

  /**
   * The number of filters with a non-empty value. Each filter id counts once,
   * regardless of how many values it holds. Reflects the draft in `manual`
   * mode.
   */
  filterCount: number

  /**
   * The filters the panel currently displays: the draft in `manual` mode, the
   * committed filters in `auto` mode.
   */
  filters: FilterPanelValue

  /**
   * Returns the human-readable label for a filter. Resolves from the panel's
   * `getFilterLabel`, then the id.
   */
  getFilterLabel: (id: string) => string

  /**
   * Returns the human-readable label for a filter value. Resolves from the
   * panel's `getFilterOptionLabel`, then `String(value)` for primitive values.
   */
  getFilterOptionLabel: (id: string, value: unknown) => string

  /**
   * Returns the current value of a filter, or `undefined` when it is not set.
   */
  getFilterValue: (id: string) => unknown

  /**
   * Whether the draft differs from the committed filters. Always `false` in
   * `auto` mode.
   */
  isDirty: boolean

  /**
   * Discards the draft and restores the committed filters. No-op in `auto`
   * mode.
   */
  reset: () => void

  /**
   * Sets the value of a filter. Empty values remove the filter. When `type` is
   * omitted, the filter keeps its existing type.
   */
  setFilterValue: (
    id: string,
    value: ValueOrFn<unknown>,
    type?: FilterPanelFilterType,
  ) => void

  // group: bindings
  getApplyTriggerBindings: () => FilterPanelApplyTriggerBindings
  getClearTriggerBindings: () => FilterPanelClearTriggerBindings
  getRootBindings: () => FilterPanelRootBindings
}
