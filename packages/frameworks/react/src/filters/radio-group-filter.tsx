// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentProps, ReactElement} from "react"

import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {useFilterSetContext} from "@qualcomm-ui/react-core/filter-set"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  FilterCollectionStatus,
  type FilterCollectionStatusTextProps,
} from "./internal/filter-collection-status.js"
import {FilterOptionLabel} from "./internal/filter-option-label.js"
import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface RadioGroupFilterProps
  extends
    Omit<
      ComponentProps<typeof RadioGroup>,
      "children" | "defaultValue" | "onValueChange" | "value"
    >,
    FilterCollectionStatusTextProps {
  /**
   * The label of a leading radio that clears the filter, such as "Any". Omit
   * to render only the collection's items.
   */
  anyLabel?: string | undefined
}

/**
 * A radio group, one radio per item of the filter's list collection. Selects
 * one item. Writes a one-item `string[]`.
 */
export function RadioGroupFilter({
  anyLabel,
  loadErrorText,
  loadingText,
  retryLabel,
  ...props
}: RadioGroupFilterProps): ReactElement {
  const filter = useFilterWidget<ListFilterDefinition>(
    "RadioGroupFilter",
    "list",
  )
  const api = useFilterSetContext()
  const qdsContext = useQdsFilterControlContext()
  const options = api.getFilterOptions(filter.id)

  return (
    <RadioGroup
      {...getFilterLabelProps(filter)}
      aria-busy={filter.collectionState?.status === "loading" || undefined}
      onValueChange={(value) => filter.setValue(value ? [value] : undefined)}
      size={qdsContext.size}
      value={filter.value?.[0] ?? (anyLabel ? "" : null)}
      {...mergeProps(qdsContext.getOptionGroupBindings(), props)}
    >
      <FilterCollectionStatus
        loadErrorText={loadErrorText}
        loadingText={loadingText}
        retryLabel={retryLabel}
        state={filter.collectionState}
      />
      {anyLabel ? <Radio label={anyLabel} value="" /> : null}
      {options.map((option) => (
        <Radio
          key={option.value}
          disabled={option.disabled}
          label={<FilterOptionLabel option={option} />}
          value={option.value}
        />
      ))}
    </RadioGroup>
  )
}
