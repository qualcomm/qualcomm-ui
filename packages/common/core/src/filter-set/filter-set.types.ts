// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  CollectionFilterId,
  FilterCollection,
  FilterDefinition,
  FilterDefinitions,
  FilterDefinitionValue,
  FilterId,
  FilterIdOfKind,
  FilterValueItem,
  FilterValues,
  IdentifiedFilterDefinition,
  UnresolvedCollectionFilterId,
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
 *
 * This is an internal storage type used by the machine. The state machine's values
 * stay untyped, the same as Tree and Select. Types are applied where the API is
 * created.
 */
export type FilterSetValues = Record<string, unknown>

/**
 * Resolves the collections of the list and tree filters whose definition has
 * none. When every list and tree filter has its own collection, the resolver
 * is never called, so any resolver is accepted.
 */
export type FilterSetCollectionResolver<TDefs> = [
  UnresolvedCollectionFilterId<TDefs>,
] extends [never]
  ? (id: never) => unknown
  : (
      id: UnresolvedCollectionFilterId<TDefs>,
    ) =>
      | FilterCollection<
          TDefs[UnresolvedCollectionFilterId<TDefs> & keyof TDefs]
        >
      | undefined

/**
 * Result counts keyed by option value.
 */
export type FilterSetOptionCounts = Record<string, number>

/**
 * One selected value of a filter in the filter set, with its label and the
 * filter it belongs to.
 */
export interface FilterSetValueItem<
  TDefs extends FilterDefinitions = FilterDefinitions,
> extends FilterValueItem {
  /**
   * The id of the filter the value belongs to. Pass it to `removeFilterValue`
   * with the item's `value` to remove the value.
   */
  filterId: FilterId<TDefs>
}

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
   * The filter definitions, created with `defineFilters`. Every filter rendered
   * in the filter set must use a definition from this object.
   */
  filters: TDefs

  /**
   * Resolves the collection of a list or tree filter whose definition has
   * none. Called during render, so it must not fetch. Load the data elsewhere,
   * such as with a query library, and return its data. Return `undefined` for
   * filters this resolver doesn't handle, or while the data loads. A filter
   * without a collection shows no options.
   */
  getFilterCollection?: FilterSetCollectionResolver<TDefs> | undefined

  /**
   * Resolves a filter's label when its definition has none. Return `undefined`
   * to fall back to the filter id.
   */
  getFilterLabel?: ((id: FilterId<TDefs>) => string | undefined) | undefined

  /**
   * Resolves the result count of each option in a filter, keyed by option
   * value. Called with the selection the controls display, so counts follow
   * the draft in `manual` mode. Options missing from the counts count 0.
   * Checkbox and radio filters show the counts and disable unselected options
   * with a count of 0. Checkbox tree filters show the counts of their leaves.
   * Return `undefined` to show no counts for the filter. Not called for range,
   * date, and text filters.
   */
  getFilterOptionCounts?:
    | ((
        id: FilterId<TDefs>,
        values: FilterValues<TDefs>,
      ) => FilterSetOptionCounts | undefined)
    | undefined

  /**
   * Resolves the bounds of a range filter when its definition has none.
   */
  getFilterRange?:
    | ((id: FilterIdOfKind<TDefs, "range">) => FilterSetRange | undefined)
    | undefined

  /**
   * Additional check for empty filter values, applied after the built-in check
   * for `undefined`, `null`, `""`, `[]`, and unbounded ranges. Empty values
   * remove the filter.
   */
  isEmptyValue?: ((id: FilterId<TDefs>, value: unknown) => boolean) | undefined

  /**
   * Called when the selection the controls display changes. In `manual` mode,
   * this is every change to the draft, including `reset` and a new `value`
   * replacing the draft. Use it to fetch option counts for the draft. In
   * `auto` mode, it is called with every committed change, after
   * `onValueChange`.
   */
  onDraftValueChange?: ((value: FilterValues<TDefs>) => void) | undefined

  /**
   * Called when the committed filters change: on apply in `manual` mode, on
   * every change in `auto` mode.
   */
  onValueChange?: ((value: FilterValues<TDefs>) => void) | undefined

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
    | "clearDraftFilters"
    | "clearFilters"
    | "invokeOnDraftValueChange"
    | "resetDraft"
    | "setDraftFilterValue"
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
    | {type: "DRAFT.CLEAR_ALL"}
    | {type: "RESET"}
    | {
        id: string
        type: "DRAFT.SET" | "FILTER.SET"
        value: ValueOrFn<unknown>
      }
  guards: {
    isAutoApply: () => boolean
  }
  props: RequiredBy<FilterSetApiProps, "applyMode" | "defaultValue">
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
   * Removes every filter from `value` and discards the draft.
   */
  clearAll: () => void

  /**
   * Removes every filter from `draftValue`. In `manual` mode, the change is
   * committed by `apply`.
   */
  clearDraftValue: () => void

  /**
   * Removes one filter from `value`. Follows the same rules as
   * `setFilterValue`.
   */
  clearFilter: (id: FilterId<TDefs>) => void

  /**
   * The selection the controls display. In `manual` mode, this is the draft,
   * which `apply` commits to `value`. In `auto` mode, it is always equal to
   * `value`.
   */
  draftValue: FilterValues<TDefs>

  /**
   * The total number of selected values in `draftValue`. Each array item
   * counts once. Ranges, dates, and text count 1.
   */
  draftValueCount: number

  /**
   * The filter definitions, from the `filters` prop. In a nested component,
   * pass their type to `useFilterSetContext` to read a typed definition, such
   * as `useFilterSetContext<typeof filters>().filters.status`.
   */
  filters: TDefs

  /**
   * Returns a filter's value in `draftValue`, or `undefined` when it is not
   * set.
   */
  getDraftValue: <K extends FilterId<TDefs>>(id: K) => FilterValues<TDefs>[K]

  /**
   * Returns how many values a filter has in `draftValue`. Each array item
   * counts once. Ranges, dates, and text count 1.
   */
  getDraftValueCount: (id: FilterId<TDefs>) => number

  /**
   * Returns the collection of a list or tree filter: the definition's
   * collection, otherwise the result of `getFilterCollection`. Returns
   * `undefined` when the filter has neither, or when `getFilterCollection`
   * returns the wrong kind of collection for the filter.
   */
  getFilterCollection: <K extends CollectionFilterId<TDefs>>(
    id: K,
  ) => FilterCollection<TDefs[K & keyof TDefs]> | undefined

  /**
   * Returns the label for a filter. Resolves from the definition, then
   * `getFilterLabel`, then the id.
   */
  getFilterLabel: (id: FilterId<TDefs>) => string

  /**
   * Returns the result count of each option in a filter from
   * `getFilterOptionCounts`, for the selection in `draftValue`. Returns
   * `undefined` when the filter has no counts.
   */
  getFilterOptionCounts: (
    id: FilterId<TDefs>,
  ) => FilterSetOptionCounts | undefined

  /**
   * Returns the bounds of a range filter from its definition, then
   * `getFilterRange`.
   */
  getFilterRange: (
    id: FilterIdOfKind<TDefs, "range">,
  ) => Partial<FilterSetRange>

  /**
   * Returns how many values a filter has in `value`. Each array item counts
   * once. Ranges, dates, and text count 1.
   */
  getValueCount: (id: FilterId<TDefs>) => number

  /**
   * Returns one item per selected value in `value`, for active filter chips.
   * Pass an id to return the items of one filter. Without an id, returns the
   * items of every filter. List and tree filters return one item per option,
   * labeled by the filter's collection, or by the value itself when the
   * collection doesn't contain it. Range, date, and text filters return one
   * item for the whole value.
   */
  getValueItems: (id?: FilterId<TDefs>) => FilterSetValueItem<TDefs>[]

  /**
   * Whether a filter has a non-empty value in `draftValue`.
   */
  hasDraftValue: (id: FilterId<TDefs>) => boolean

  /**
   * Whether `draftValue` differs from `value`. Always `false` in `auto` mode.
   */
  isDirty: boolean

  /**
   * Removes one of a filter's values from `value`, given the `value` of an
   * item from `getValueItems`. Range, date, and text filters are cleared.
   * Follows the same rules as `setFilterValue`.
   */
  removeFilterValue: (id: FilterId<TDefs>, value: string) => void

  /**
   * Discards the draft and restores the committed filters. No-op in `auto`
   * mode.
   */
  reset: () => void

  /**
   * Sets a filter's value in `draftValue`. Empty values remove the filter. In
   * `manual` mode, the change is committed by `apply`.
   */
  setDraftValue: <K extends FilterId<TDefs>>(
    id: K,
    value: ValueOrFn<FilterValues<TDefs>[K]>,
  ) => void

  /**
   * Sets a filter's value in `value`. Empty values remove the filter. In
   * `manual` mode, the same change is made to the draft, which keeps its
   * other changes.
   */
  setFilterValue: <K extends FilterId<TDefs>>(
    id: K,
    value: ValueOrFn<FilterValues<TDefs>[K]>,
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

export interface FilterStateOptions {
  /**
   * The id of the element that labels the filter. Controls reference it with
   * `aria-labelledby`. When omitted, controls use the filter's label as their
   * `aria-label`.
   */
  labelId?: string | undefined
}

/**
 * The state of one filter in a filter set, read by its controls.
 */
export interface FilterState<TDef extends FilterDefinition = FilterDefinition> {
  /**
   * Removes the filter's value. In `manual` mode, the change is committed by
   * the filter set's `apply`.
   */
  clear: () => void

  /**
   * The collection of a list or tree filter. `undefined` for other filter
   * kinds, and for collection filters with no collection.
   *
   * @inheritDoc
   */
  collection: FilterCollection<TDef> | undefined

  /**
   * How many values the filter contributes to the filter set's
   * `draftValueCount`.
   */
  count: number

  /**
   * The filter's definition.
   *
   * @inheritDoc
   */
  definition: IdentifiedFilterDefinition<TDef>

  /**
   * The filter id.
   */
  id: TDef extends {readonly id: infer TId extends string} ? TId : string

  /**
   * Whether the filter has a non-empty value.
   */
  isActive: boolean

  /**
   * The resolved string label. Used for accessible names and summaries.
   */
  label: string

  /**
   * The id of the element that labels the filter, such as the filter panel's
   * filter label. Controls reference it with `aria-labelledby`. When unset,
   * controls use `label` as their `aria-label`.
   */
  labelId: string | undefined

  /**
   * The result count of each option, keyed by option value, from the filter
   * set's `getFilterOptionCounts`. Options missing from the counts count 0.
   * `undefined` when the filter has no counts.
   */
  optionCounts: FilterSetOptionCounts | undefined

  /**
   * Sets the filter's value. In `manual` mode, the change is committed by the
   * filter set's `apply`.
   */
  setValue: (value: ValueOrFn<FilterDefinitionValue<TDef> | undefined>) => void

  /**
   * The filter's displayed value. In `manual` mode, this is the draft value.
   */
  value: FilterDefinitionValue<TDef> | undefined
}
