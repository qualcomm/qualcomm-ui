// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  FilterDefinitions,
  FilterOption,
  FilterOptionObject,
  FilterValues,
} from "@qualcomm-ui/core/filters"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  MachineSchema,
  ValueOrFn,
} from "@qualcomm-ui/utils/machine"

/**
 * - `manual`: changes are staged in a draft and committed when applied.
 * - `auto`: changes are committed immediately.
 */
export type FilterSetApplyMode = "auto" | "manual"

/**
 * Filter values keyed by filter id. An empty filter is an absent key.
 */
export type FilterSetValues = Record<string, unknown>

/**
 * Option labels recorded from user selections, keyed by filter id, then by
 * option value.
 */
export type FilterSetOptionLabels = Record<string, Record<string, string>>

export interface FilterSetValueChangeDetails {
  /**
   * Labels of the selected options, recorded when they were picked. Persist
   * these with saved views to label restored values before their options load.
   */
  labels: FilterSetOptionLabels
}

export interface SetFilterValueDetails {
  /**
   * Labels of the picked options, keyed by option value. Used to label the
   * selection when the options are not available, such as in active filter
   * chips.
   */
  labels?: Record<string, string> | undefined
}

/**
 * Result counts keyed by option value.
 */
export type FilterSetOptionCounts = Map<string, number> | Record<string, number>

export interface FilterSetRange {
  max: number
  min: number
}

export interface FilterSetApiProps<
  TDefs extends FilterDefinitions = FilterDefinitions,
> {
  /**
   * Controls when filter changes are committed.
   *
   * @default "auto"
   */
  applyMode?: FilterSetApplyMode | undefined

  /**
   * The initial committed filters. Use when you don't need to control the
   * committed filters.
   *
   * @default {}
   */
  defaultValue?: FilterValues<TDefs> | undefined

  /**
   * The filter definitions, created with `defineFilters`.
   */
  filters?: TDefs | undefined

  /**
   * Resolves a filter's label when its definition has none. Return `undefined`
   * to fall back to the filter id.
   */
  getFilterLabel?: ((id: string) => string | undefined) | undefined

  /**
   * Resolves the result count of each option in a filter, keyed by option
   * value. Called with the selection the controls display, so counts follow
   * the draft in `manual` mode. Unselected options with a count of 0 are
   * disabled. Return `undefined` to show no counts for the filter.
   */
  getFilterOptionCounts?:
    | ((
        id: string,
        values: FilterSetValues,
      ) => FilterSetOptionCounts | undefined)
    | undefined

  /**
   * Resolves an option's label when neither the definition nor a recorded
   * selection provides one. Return `undefined` to fall back to the value.
   */
  getFilterOptionLabel?:
    | ((id: string, value: string) => string | undefined)
    | undefined

  /**
   * Resolves options for an option-based filter when neither the filter
   * component nor its definition provides them.
   */
  getFilterOptions?: ((id: string) => FilterOption[] | undefined) | undefined

  /**
   * Resolves the bounds of a range filter when its definition has none.
   */
  getFilterRange?: ((id: string) => FilterSetRange | undefined) | undefined

  /**
   * Additional check for empty filter values, applied after the built-in check
   * for `undefined`, `null`, `""`, `[]`, and unbounded ranges. Empty values
   * remove the filter.
   */
  isEmptyValue?: ((id: string, value: unknown) => boolean) | undefined

  /**
   * Called when the committed filters change: on apply in `manual` mode, on
   * every change in `auto` mode.
   */
  onValueChange?:
    | ((
        value: FilterValues<TDefs>,
        details: FilterSetValueChangeDetails,
      ) => void)
    | undefined

  /**
   * The controlled committed filters.
   */
  value?: FilterValues<TDefs> | undefined
}

/**
 * Staged changes in `manual` mode.
 */
export interface FilterSetDraft {
  /**
   * Hash of the committed value the draft was started from.
   */
  base: string
  values: FilterSetValues
}

export interface FilterSetSchema extends MachineSchema {
  actions: ActionSchema<
    | "applyDraft"
    | "clearFilters"
    | "recordLabels"
    | "resetDraft"
    | "setFilterValue"
  >
  computed: {
    /**
     * The selection the controls display: the draft in `manual` mode, the
     * committed value in `auto` mode.
     */
    draftValue: FilterSetValues
  }
  context: {
    draft: FilterSetDraft | null
    value: FilterSetValues
  }
  events:
    | {type: "APPLY"}
    | {type: "CLEAR_ALL"}
    | {type: "RESET"}
    | {
        id: string
        labels?: Record<string, string> | undefined
        type: "FILTER.SET"
        value: ValueOrFn<unknown>
      }
  guards: {
    isAutoApply: () => boolean
  }
  props: RequiredBy<FilterSetApiProps, "applyMode" | "defaultValue">
  refs: {
    /**
     * Option labels recorded from user selections.
     */
    labels: FilterSetOptionLabels
  }
  state: "idle"
}

export interface FilterSetApi<
  TDefs extends FilterDefinitions = FilterDefinitions,
> {
  /**
   * Commits the draft. No-op in `auto` mode.
   */
  apply: () => void

  /**
   * Controls when filter changes are committed.
   */
  applyMode: FilterSetApplyMode

  /**
   * Removes every filter. In `manual` mode this clears the draft and must be
   * applied; in `auto` mode it clears the committed filters immediately.
   */
  clearAll: () => void

  /**
   * Removes one filter. Follows the same commit rules as `clearAll`.
   */
  clearFilter: (id: keyof TDefs & string) => void

  /**
   * The selection the controls display. In `manual` mode, this is the draft,
   * which `apply` commits to `value`. In `auto` mode, it is always equal to
   * `value`.
   */
  draftValue: FilterValues<TDefs>

  /**
   * The total number of selected values in `draftValue`. Each array item
   * counts once; ranges, dates, and text count 1.
   */
  draftValueCount: number

  /**
   * The filter definitions, from the `filters` prop.
   */
  filters: TDefs | undefined

  /**
   * Returns a filter's value in `draftValue`, or `undefined` when it is not
   * set.
   */
  getDraftValue: <K extends keyof TDefs & string>(
    id: K,
  ) => FilterValues<TDefs>[K]

  /**
   * Returns the label for a filter. Resolves from the definition, then
   * `getFilterLabel`, then the id.
   */
  getFilterLabel: (id: string) => string

  /**
   * Returns the result count of an option from `getFilterOptionCounts`, or
   * `undefined` when the filter has no counts. Options missing from the
   * filter's counts count 0.
   */
  getFilterOptionCount: (id: string, value: string) => number | undefined

  /**
   * Returns the label for an option value. Resolves from the definition's
   * `getOptionLabel`, then labels recorded from user selections, then
   * `getFilterOptionLabel`, then the value itself.
   */
  getFilterOptionLabel: (id: string, value: string) => string

  /**
   * Returns the options for an option-based filter from its definition, then
   * `getFilterOptions`. Filter components prefer their own `options` prop.
   */
  getFilterOptions: (id: string) => FilterOptionObject[]

  /**
   * Returns the bounds of a range filter from its definition, then
   * `getFilterRange`.
   */
  getFilterRange: (id: string) => Partial<FilterSetRange>

  /**
   * Returns how many values a filter value contributes to a count. Arrays
   * count their length; ranges, dates, and text count 1. Empty values count 0.
   */
  getValueCount: (id: string, value: unknown) => number

  /**
   * Returns the labels that summarize a filter value, such as one label per
   * active filter chip. Pass a value from `value` or `draftValue`.
   */
  getValueLabels: (id: string, value: unknown) => string[]

  /**
   * Whether `draftValue` differs from `value`. Always `false` in `auto` mode.
   */
  isDirty: boolean

  /**
   * Whether a filter has a non-empty value in `draftValue`.
   */
  isFilterActive: (id: string) => boolean

  /**
   * Discards the draft and restores the committed filters. No-op in `auto`
   * mode.
   */
  reset: () => void

  /**
   * Sets the value of a filter. Empty values remove the filter. Filter
   * controls pass the labels of the picked options in `details`.
   */
  setFilterValue: <K extends keyof TDefs & string>(
    id: K,
    value: ValueOrFn<FilterValues<TDefs>[K]>,
    details?: SetFilterValueDetails,
  ) => void

  /**
   * The committed selection.
   */
  value: FilterValues<TDefs>

  /**
   * The total number of selected values in `value`. Each array item counts
   * once; ranges, dates, and text count 1. Equal to `draftValueCount` in
   * `auto` mode.
   */
  valueCount: number
}
