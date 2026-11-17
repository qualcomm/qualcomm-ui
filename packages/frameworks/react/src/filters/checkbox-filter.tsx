// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {
  CheckboxFilterDefinition,
  FilterOption,
} from "@qualcomm-ui/core/filters"
import {useFilterPanelFilter} from "@qualcomm-ui/react-core/filter-panel"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {useQdsFilterPanelContext} from "@qualcomm-ui/react/filter-panel"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {FilterSection, type FilterSectionProps} from "./filter-section.js"
import {useFilterOptions} from "./internal/use-filter-options.js"

export interface CheckboxFilterControlProps extends Omit<
  ElementRenderProp<"div">,
  "children"
> {
  /**
   * The options to render. Takes precedence over the definition's options and
   * the panel's resolver.
   */
  options?: FilterOption[] | undefined
}

/**
 * A group of checkboxes, one per option. Renders a `<div>` element by default.
 */
export function CheckboxFilterControl({
  options,
  ...props
}: CheckboxFilterControlProps): ReactElement {
  const filter = useFilterPanelFilter<CheckboxFilterDefinition>()
  const qdsContext = useQdsFilterPanelContext()
  const items = useFilterOptions(options)
  const selected = filter.value ?? []

  const mergedProps = mergeProps(
    qdsContext.getOptionGroupBindings(),
    {"aria-labelledby": filter.labelId, role: "group"},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {items.map((option) => (
        <Checkbox
          key={option.value}
          checked={selected.includes(option.value)}
          disabled={option.disabled}
          label={option.label}
          onCheckedChange={(checked) =>
            filter.setValue(
              (prev = []) =>
                checked
                  ? [...prev, option.value]
                  : prev.filter((value) => value !== option.value),
              {labels: {[option.value]: option.label}},
            )
          }
          size={qdsContext.controlSize}
        />
      ))}
    </PolymorphicElement>
  )
}

export interface CheckboxFilterProps
  extends
    FilterSectionProps<CheckboxFilterDefinition>,
    Omit<CheckboxFilterControlProps, keyof FilterSectionProps> {}

/**
 * A filter that selects any number of options with checkboxes. Writes a
 * `string[]`.
 */
export function CheckboxFilter({
  contentProps,
  defaultOpen,
  filter,
  label,
  onOpenChange,
  open,
  rootProps,
  triggerProps,
  ...props
}: CheckboxFilterProps): ReactElement {
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
      <CheckboxFilterControl {...props} />
    </FilterSection>
  )
}
