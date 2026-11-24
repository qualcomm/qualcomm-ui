// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentProps, ReactElement} from "react"

import {createRadioGroupFilterApi} from "@qualcomm-ui/core/filter-control"
import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {useFilter} from "@qualcomm-ui/react-core/filter-set"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {FilterOptionLabel} from "./internal/filter-option-label.js"
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
 * one item. Writes a one-item `string[]`. Renders nothing while the filter has
 * no collection.
 */
export function RadioGroupFilter({
  anyLabel,
  ...props
}: RadioGroupFilterProps): ReactElement | null {
  const api = createRadioGroupFilterApi(useFilter<ListFilterDefinition>(), {
    anyLabel,
  })
  const qdsContext = useQdsFilterControlContext()

  if (!api.options) {
    return null
  }

  return (
    <RadioGroup
      {...api.getLabelProps()}
      onValueChange={api.setValue}
      size={qdsContext.size}
      value={api.value}
      {...mergeProps(qdsContext.getOptionGroupBindings(), props)}
    >
      {api.options.map((option) => (
        <Radio
          key={option.value}
          disabled={option.disabled}
          label={
            <FilterOptionLabel count={option.count} label={option.label} />
          }
          value={option.value}
        />
      ))}
    </RadioGroup>
  )
}
