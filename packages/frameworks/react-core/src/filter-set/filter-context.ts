// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterSetCollectionState} from "@qualcomm-ui/core/filter-set"
import type {
  FilterDefinition,
  FilterDefinitionValue,
  IdentifiedFilterDefinition,
} from "@qualcomm-ui/core/filters"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {ValueOrFn} from "@qualcomm-ui/utils/machine"

export interface FilterContextValue<
  TDef extends FilterDefinition = FilterDefinition,
> {
  /**
   * Removes the filter's value.
   */
  clear: () => void

  /**
   * The state of a list or tree filter's collection. `undefined` for other
   * filter kinds, and for collection filters with no collection.
   *
   * @inheritDoc
   */
  collectionState: FilterSetCollectionState | undefined

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
  id: string

  /**
   * Whether the filter has a non-empty value.
   */
  isActive: boolean

  /**
   * The resolved string label. Used for accessible names and summaries.
   */
  label: string

  /**
   * The id of the element that labels the filter, such as
   * `FilterPanel.FilterLabel`. Controls reference it with `aria-labelledby`.
   * When unset, controls use `label` as their `aria-label`.
   */
  labelId: string | undefined

  /**
   * Sets the filter's value.
   */
  setValue: (value: ValueOrFn<FilterDefinitionValue<TDef> | undefined>) => void

  /**
   * The filter's displayed value. In `manual` mode, this is the draft value.
   */
  value: FilterDefinitionValue<TDef> | undefined
}

export const [FilterContextProvider, useFilterContext] =
  createGuardedContext<FilterContextValue>({
    hookName: "useFilter",
    providerName: "<FilterProvider>",
    strict: true,
  })
