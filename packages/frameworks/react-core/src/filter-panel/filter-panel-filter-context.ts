// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterPanelSetValueDetails} from "@qualcomm-ui/core/filter-panel"
import type {
  FilterDefinition,
  FilterDefinitionValue,
  IdentifiedFilterDefinition,
} from "@qualcomm-ui/core/filters"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {ValueOrFn} from "@qualcomm-ui/utils/machine"

export interface FilterPanelFilterContextValue<
  TDef extends FilterDefinition = FilterDefinition,
> {
  /**
   * Removes the filter's value.
   */
  clear: () => void

  /**
   * How many values the filter contributes to the panel's `draftValueCount`.
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
   * The id of the filter's label element. Controls reference it with
   * `aria-labelledby`.
   */
  labelId: string

  /**
   * Sets the filter's value. Pass the labels of picked options in `details` so
   * the selection can be labeled outside the panel.
   * @inheritDoc
   */
  setValue: (
    value: ValueOrFn<FilterDefinitionValue<TDef> | undefined>,
    details?: FilterPanelSetValueDetails,
  ) => void

  /**
   * The filter's displayed value. Also, the draft in `manual` mode.
   */
  value: FilterDefinitionValue<TDef> | undefined
}

export const [FilterPanelFilterContextProvider, useFilterPanelFilterContext] =
  createGuardedContext<FilterPanelFilterContextValue>({
    hookName: "useFilterPanelFilterContext",
    providerName: "<FilterPanelFilterContextProvider>",
    strict: true,
  })
