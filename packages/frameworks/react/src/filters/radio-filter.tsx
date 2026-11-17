// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentProps, ReactElement} from "react"

import type {
  FilterPanelOption,
  RadioFilterDefinition,
} from "@qualcomm-ui/core/filter-panel"
import {useFilterPanelFilter} from "@qualcomm-ui/react-core/filter-panel"
import {useQdsFilterPanelContext} from "@qualcomm-ui/react/filter-panel"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

import {FilterSection, type FilterSectionProps} from "./filter-section.js"
import {useFilterOptions} from "./internal/use-filter-options.js"

export interface RadioFilterControlProps extends Omit<
  ComponentProps<typeof RadioGroup>,
  "children" | "defaultValue" | "onValueChange" | "value"
> {
  /**
   * The options to render. An option whose value is `""` clears the filter,
   * for example an "All" option. Takes precedence over the definition's
   * options and the panel's resolver.
   */
  options?: FilterPanelOption[] | undefined
}

/**
 * A radio group, one radio per option.
 */
export function RadioFilterControl({
  options,
  ...props
}: RadioFilterControlProps): ReactElement {
  const filter = useFilterPanelFilter<RadioFilterDefinition>()
  const qdsContext = useQdsFilterPanelContext()
  const items = useFilterOptions(options)
  const blankOption = items.find((option) => option.value === "")

  return (
    <RadioGroup
      aria-labelledby={filter.labelId}
      onValueChange={(value) => {
        const option = items.find((item) => item.value === value)
        filter.setValue(
          value ? [value] : undefined,
          option ? {labels: {[option.value]: option.label}} : undefined,
        )
      }}
      size={qdsContext.controlSize}
      value={filter.value?.[0] ?? (blankOption ? "" : null)}
      {...props}
    >
      {items.map((option) => (
        <Radio
          key={option.value}
          disabled={option.disabled}
          label={option.label}
          value={option.value}
        />
      ))}
    </RadioGroup>
  )
}

export interface RadioFilterProps
  extends
    FilterSectionProps<RadioFilterDefinition>,
    Omit<RadioFilterControlProps, keyof FilterSectionProps> {}

/**
 * A filter that selects one option with radios. Writes a one-item
 * `string[]`.
 */
export function RadioFilter({
  contentProps,
  defaultOpen,
  filter,
  label,
  onOpenChange,
  open,
  rootProps,
  triggerProps,
  ...props
}: RadioFilterProps): ReactElement {
  return (
    <FilterSection
      contentProps={contentProps}
      defaultOpen={defaultOpen}
      filter={filter}
      label={label}
      onOpenChange={onOpenChange}
      open={open}
      rootProps={rootProps}
      triggerProps={triggerProps}
    >
      <RadioFilterControl {...props} />
    </FilterSection>
  )
}
