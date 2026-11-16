// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Column, ColumnFiltersState, Updater} from "@qualcomm-ui/core/table"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {ActionSchema, JSX, MachineSchema} from "@qualcomm-ui/utils/machine"

import type {tableFilterPanelAnatomy} from "./table-filter-panel.anatomy.js"

/**
 * - `manual`: changes are staged in a draft and committed when applied.
 * - `auto`: changes are committed immediately.
 */
export type TableFilterPanelApplyMode = "auto" | "manual"

/**
 * Resolves the column for a filter id. Returns `undefined` for filters without
 * a backing column.
 */
export type TableFilterPanelColumnResolver = (
  id: string,
) => Column<any, unknown> | undefined

export interface TableFilterPanelFilterRegistration {
  /**
   * Returns a human-readable label for a value of this filter. Takes precedence
   * over the column's `getFilterOptionLabel`.
   */
  getOptionLabel?: ((value: unknown) => string) | undefined

  /**
   * The filter id. Matches a column id for column filters, but may be any
   * string for filters without a backing column.
   */
  id: string

  /**
   * Human-readable label for the filter. Takes precedence over the column's
   * filter label.
   */
  label?: string | undefined
}

export interface TableFilterPanelApiProps {
  /**
   * Controls when filter changes are committed.
   *
   * @default "manual"
   */
  applyMode?: TableFilterPanelApplyMode | undefined

  /**
   * The initial committed filters. Use when you don't need to control the
   * committed filters.
   *
   * @default []
   */
  defaultValue?: ColumnFiltersState | undefined

  /**
   * Resolves the column for a filter id. Used to detect empty values through
   * the column's filter function and to resolve column filter labels. Without
   * it, only generic empty checks apply and labels fall back to the filter id
   * and `String(value)`.
   */
  getColumn?: TableFilterPanelColumnResolver | undefined

  /**
   * Called when the committed filters change: on apply in `manual` mode, on
   * every change in `auto` mode.
   */
  onValueChange?: ((filters: ColumnFiltersState) => void) | undefined

  /**
   * The controlled committed filters.
   */
  value?: ColumnFiltersState | undefined
}

export interface TableFilterPanelSchema extends MachineSchema {
  actions: ActionSchema<
    | "applyDraft"
    | "clearFilters"
    | "registerFilter"
    | "resetDraft"
    | "setFilterValue"
    | "syncDraft"
    | "unregisterFilter"
  >
  computed: {
    /**
     * The filters the panel currently displays: the draft in `manual` mode, the
     * committed filters in `auto` mode.
     */
    filters: ColumnFiltersState
  }
  context: {
    draft: ColumnFiltersState
    registryVersion: number
    value: ColumnFiltersState
  }
  events:
    | {type: "APPLY"}
    | {type: "CLEAR_ALL"}
    | {type: "RESET"}
    | {id: string; type: "FILTER.SET"; value: Updater<unknown>}
    | {filter: TableFilterPanelFilterRegistration; type: "FILTER.REGISTER"}
    | {id: string; type: "FILTER.UNREGISTER"}
  guards: {
    isAutoApply: () => boolean
  }
  props: RequiredBy<TableFilterPanelApiProps, "applyMode" | "defaultValue">
  refs: {
    /**
     * The committed filters as of the last sync. Used to decide whether the
     * draft has diverged from them.
     */
    appliedFilters: ColumnFiltersState
    registry: Map<string, TableFilterPanelFilterRegistration>
  }
  state: "idle"
}

type PartName = AnatomyPartName<typeof tableFilterPanelAnatomy>
interface Part<P extends PartName> extends AnatomyPart<
  "table-filter-panel",
  P
> {}

export interface TableFilterPanelRootBindings extends Part<"root"> {
  "data-apply-mode": TableFilterPanelApplyMode
  "data-dirty": BooleanDataAttr
}

export interface TableFilterPanelApplyTriggerBindings extends Part<"applyTrigger"> {
  "data-disabled": BooleanDataAttr
  disabled: boolean
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface TableFilterPanelClearTriggerBindings extends Part<"clearTrigger"> {
  "data-disabled": BooleanDataAttr
  disabled: boolean
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface TableFilterPanelApi {
  /**
   * Commits the draft. No-op in `auto` mode.
   */
  apply: () => void

  /**
   * Controls when filter changes are committed.
   */
  applyMode: TableFilterPanelApplyMode

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
  filters: ColumnFiltersState

  /**
   * Returns the human-readable label for a filter. Resolves from the
   * registered filter label, then the column's filter label, then the id.
   */
  getFilterLabel: (id: string) => string

  /**
   * Returns the human-readable label for a filter value. Resolves from the
   * registered filter's `getOptionLabel`, then the column's
   * `getFilterOptionLabel`, then `String(value)` for primitive values.
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
   * Registers label metadata for a filter. Call when a filter control mounts.
   */
  registerFilter: (filter: TableFilterPanelFilterRegistration) => void

  /**
   * Discards the draft and restores the committed filters. No-op in `auto`
   * mode.
   */
  reset: () => void

  /**
   * Sets the value of a filter. Empty values remove the filter.
   */
  setFilterValue: (id: string, value: Updater<unknown>) => void

  /**
   * Removes label metadata for a filter. Call when a filter control unmounts.
   */
  unregisterFilter: (id: string) => void

  // group: bindings
  getApplyTriggerBindings: () => TableFilterPanelApplyTriggerBindings
  getClearTriggerBindings: () => TableFilterPanelClearTriggerBindings
  getRootBindings: () => TableFilterPanelRootBindings
}
