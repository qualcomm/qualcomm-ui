// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  FilterDefinition,
  FilterDefinitionValue,
  FilterPanelSetValueDetails,
  IdentifiedFilterDefinition,
} from "@qualcomm-ui/core/filter-panel"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {ValueOrFn} from "@qualcomm-ui/utils/machine"

export interface FilterPanelFilterContextValue<
  TDefinition extends FilterDefinition = FilterDefinition,
> {
  /**
   * Removes the filter's value.
   */
  clear: () => void

  /**
   * How many values the filter contributes to the panel's value count.
   */
  count: number

  /**
   * The filter's definition.
   */
  definition: IdentifiedFilterDefinition<TDefinition>

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
   */
  setValue: (
    value: ValueOrFn<FilterDefinitionValue<TDefinition> | undefined>,
    details?: FilterPanelSetValueDetails,
  ) => void

  /**
   * The filter's displayed value: the draft in `manual` mode.
   */
  value: FilterDefinitionValue<TDefinition> | undefined
}

export const [FilterPanelFilterContextProvider, useFilterPanelFilterContext] =
  createGuardedContext<FilterPanelFilterContextValue>({
    hookName: "useFilterPanelFilterContext",
    providerName: "<FilterPanelFilterContextProvider>",
    strict: true,
  })
