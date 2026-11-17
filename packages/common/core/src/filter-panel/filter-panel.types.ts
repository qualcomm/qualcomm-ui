// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  FilterDefinitions,
  FilterOption,
  FilterOptionObject,
  FilterValues,
} from "@qualcomm-ui/core/filters"
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
 * Filter values keyed by filter id. An empty filter is an absent key.
 */
export type FilterPanelValues = Record<string, unknown>

/**
 * Option labels recorded from user selections, keyed by filter id, then by
 * option value.
 */
export type FilterPanelOptionLabels = Record<string, Record<string, string>>

export interface FilterPanelValueChangeDetails {
  /**
   * Labels of the selected options, recorded when they were picked. Persist
   * these with saved views to label restored values before their options load.
   */
  labels: FilterPanelOptionLabels
}

export interface FilterPanelSetValueDetails {
  /**
   * Labels of the picked options, keyed by option value. Used to label the
   * selection outside the panel when the options are not available.
   */
  labels?: Record<string, string> | undefined
}

export interface FilterPanelRange {
  max: number
  min: number
}

export interface FilterPanelApiProps<
  TDefinitions extends FilterDefinitions = FilterDefinitions,
> {
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
   * @default {}
   */
  defaultValue?: FilterValues<TDefinitions> | undefined

  /**
   * The panel's filter definitions, created with `defineFilters`.
   */
  filters?: TDefinitions | undefined

  /**
   * Resolves a filter's label when its definition has none. Return `undefined`
   * to fall back to the filter id.
   */
  getFilterLabel?: ((id: string) => string | undefined) | undefined

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
  getFilterRange?: ((id: string) => FilterPanelRange | undefined) | undefined

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
        value: FilterValues<TDefinitions>,
        details: FilterPanelValueChangeDetails,
      ) => void)
    | undefined

  /**
   * The controlled committed filters.
   */
  value?: FilterValues<TDefinitions> | undefined
}

export interface FilterPanelSchema extends MachineSchema {
  actions: ActionSchema<
    | "applyDraft"
    | "clearFilters"
    | "recordLabels"
    | "resetDraft"
    | "setFilterValue"
    | "syncDraft"
  >
  computed: {
    /**
     * The selection the controls display: the draft in `manual` mode, the
     * committed value in `auto` mode.
     */
    draftValue: FilterPanelValues
  }
  context: {
    draft: FilterPanelValues
    value: FilterPanelValues
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
  props: RequiredBy<FilterPanelApiProps, "applyMode" | "defaultValue">
  refs: {
    /**
     * The committed filters as of the last sync. Used to decide whether the
     * draft has diverged from them.
     */
    appliedFilters: FilterPanelValues
    /**
     * Option labels recorded from user selections.
     */
    labels: FilterPanelOptionLabels
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

export interface FilterPanelFilterBindingsProps {
  /**
   * The filter id.
   */
  id: string
}

export interface FilterPanelFilterBindings extends Part<"filter"> {
  "data-active": BooleanDataAttr
  "data-filter-id": string
}

export interface FilterPanelFilterLabelBindings extends Part<"filterLabel"> {
  "data-active": BooleanDataAttr
}

export interface FilterPanelFilterCountBindings extends Part<"filterCount"> {
  "aria-label": string
  hidden: boolean
}

export interface FilterPanelApi<
  TDefinitions extends FilterDefinitions = FilterDefinitions,
> {
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
   * Removes one filter. Follows the same commit rules as `clearAll`.
   */
  clearFilter: (id: keyof TDefinitions & string) => void

  /**
   * The selection the controls display. In `manual` mode, this is the draft,
   * which `apply` commits to `value`. In `auto` mode, it is always equal to
   * `value`.
   */
  draftValue: FilterValues<TDefinitions>

  /**
   * The total number of selected values in `draftValue`. Each array item
   * counts once; ranges, dates, and text count 1.
   */
  draftValueCount: number

  /**
   * The panel's filter definitions, from the `filters` prop.
   */
  filters: TDefinitions | undefined

  /**
   * Returns a filter's value in `draftValue`, or `undefined` when it is not
   * set.
   */
  getDraftValue: <K extends keyof TDefinitions & string>(
    id: K,
  ) => FilterValues<TDefinitions>[K]

  /**
   * Returns the label for a filter. Resolves from the definition, then the
   * panel's `getFilterLabel`, then the id.
   */
  getFilterLabel: (id: string) => string

  /**
   * Returns the label for an option value. Resolves from the definition's
   * `getOptionLabel`, then labels recorded from user selections, then the
   * panel's `getFilterOptionLabel`, then the value itself.
   */
  getFilterOptionLabel: (id: string, value: string) => string

  /**
   * Returns the options for an option-based filter from its definition, then
   * the panel's `getFilterOptions`. Filter components prefer their own
   * `options` prop.
   */
  getFilterOptions: (id: string) => FilterOptionObject[]

  /**
   * Returns the bounds of a range filter from its definition, then the panel's
   * `getFilterRange`.
   */
  getFilterRange: (id: string) => Partial<FilterPanelRange>

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
   * Discards the draft and restores the committed filters. No-op in `auto`
   * mode.
   */
  reset: () => void

  /**
   * Sets the value of a filter. Empty values remove the filter. Filter
   * controls pass the labels of the picked options in `details`.
   */
  setFilterValue: <K extends keyof TDefinitions & string>(
    id: K,
    value: ValueOrFn<FilterValues<TDefinitions>[K]>,
    details?: FilterPanelSetValueDetails,
  ) => void

  /**
   * The committed selection.
   */
  value: FilterValues<TDefinitions>

  /**
   * The total number of selected values in `value`. Each array item counts
   * once; ranges, dates, and text count 1. Equal to `draftValueCount` in
   * `auto` mode.
   */
  valueCount: number

  // group: bindings
  getApplyTriggerBindings: () => FilterPanelApplyTriggerBindings
  getClearTriggerBindings: () => FilterPanelClearTriggerBindings
  getFilterBindings: (
    props: FilterPanelFilterBindingsProps,
  ) => FilterPanelFilterBindings
  getFilterCountBindings: (
    props: FilterPanelFilterBindingsProps,
  ) => FilterPanelFilterCountBindings
  getFilterLabelBindings: (
    props: FilterPanelFilterBindingsProps,
  ) => FilterPanelFilterLabelBindings
  getRootBindings: () => FilterPanelRootBindings
}
