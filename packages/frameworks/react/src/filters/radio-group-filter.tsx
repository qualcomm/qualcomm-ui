// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentProps, ReactElement} from "react"

import type {
  FilterOption,
  OptionFilterDefinition,
} from "@qualcomm-ui/core/filters"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {FilterOptionLabel} from "./internal/filter-option-label.js"
import {useFilterOptions} from "./internal/use-filter-options.js"
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
   * The options to render. An option whose value is `""` clears the filter,
   * for example an "All" option. Takes precedence over the definition's
   * options and the filter set's resolver.
   */
  options?: FilterOption[] | undefined
}

/**
 * A radio group, one radio per option. Selects one option. Writes a one-item
 * `string[]`.
 */
export function RadioGroupFilter({
  options,
  ...props
}: RadioGroupFilterProps): ReactElement {
  const filter = useFilterWidget<OptionFilterDefinition>(
    "RadioGroupFilter",
    "option",
  )
  const qdsContext = useQdsFilterControlContext()
  const items = useFilterOptions(options)
  const blankOption = items.find((option) => option.value === "")

  return (
    <RadioGroup
      {...getFilterLabelProps(filter)}
      onValueChange={(value) => {
        const option = items.find((item) => item.value === value)
        filter.setValue(
          value ? [value] : undefined,
          option ? {labels: {[option.value]: option.label}} : undefined,
        )
      }}
      size={qdsContext.size}
      value={filter.value?.[0] ?? (blankOption ? "" : null)}
      {...mergeProps(qdsContext.getOptionGroupBindings(), props)}
    >
      {items.map((option) => (
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
