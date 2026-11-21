// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentProps, ReactElement} from "react"

import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"
import {ListCollection} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {FilterOptionLabel} from "./internal/filter-option-label.js"
import {getOptionCount} from "./internal/get-option-count.js"
import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface RadioGroupFilterProps extends Omit<
  ComponentProps<typeof RadioGroup>,
  "children" | "defaultValue" | "onValueChange" | "value"
> {
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
  ...props
}: RadioGroupFilterProps): ReactElement {
  const filter = useFilterWidget<ListFilterDefinition>(
    "RadioGroupFilter",
    "list",
  )
  const qdsContext = useQdsFilterControlContext()
  const collection =
    filter.collection instanceof ListCollection ? filter.collection : undefined
  const selected = filter.value?.[0]

  return (
    <RadioGroup
      {...getFilterLabelProps(filter)}
      onValueChange={(value) => filter.setValue(value ? [value] : undefined)}
      size={qdsContext.size}
      value={selected ?? (anyLabel ? "" : null)}
      {...mergeProps(qdsContext.getOptionGroupBindings(), props)}
    >
      {anyLabel ? <Radio label={anyLabel} value="" /> : null}
      {collection?.items.map((item) => {
        const value = collection.getItemValue(item)
        if (value === null) {
          return null
        }
        const count = getOptionCount(filter.optionCounts, value)
        return (
          <Radio
            key={value}
            disabled={
              !!collection.getItemDisabled(item) ||
              (count === 0 && value !== selected)
            }
            label={
              <FilterOptionLabel
                count={count}
                label={collection.stringifyItem(item) ?? value}
              />
            }
            value={value}
          />
        )
      })}
    </RadioGroup>
  )
}
