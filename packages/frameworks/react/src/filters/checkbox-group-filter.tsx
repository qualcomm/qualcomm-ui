// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {
  FilterOption,
  OptionFilterDefinition,
} from "@qualcomm-ui/core/filters"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {FilterOptionLabel} from "./internal/filter-option-label.js"
import {useFilterOptions} from "./internal/use-filter-options.js"
import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface CheckboxGroupFilterProps extends Omit<
  ElementRenderProp<"div">,
  "children"
> {
  /**
   * The options to render. Takes precedence over the definition's options and
   * the filter set's resolver.
   */
  options?: FilterOption[] | undefined
}

/**
 * A group of checkboxes, one per option. Selects any number of options.
 * Writes a `string[]`. Renders a `<div>` element by default.
 */
export function CheckboxGroupFilter({
  options,
  ...props
}: CheckboxGroupFilterProps): ReactElement {
  const filter = useFilterWidget<OptionFilterDefinition>(
    "CheckboxGroupFilter",
    "option",
  )
  const qdsContext = useQdsFilterControlContext()
  const items = useFilterOptions(options)
  const selected = filter.value ?? []

  const mergedProps = mergeProps(
    qdsContext.getOptionGroupBindings(),
    {...getFilterLabelProps(filter), role: "group"},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {items.map((option) => (
        <Checkbox
          key={option.value}
          checked={selected.includes(option.value)}
          disabled={option.disabled}
          label={<FilterOptionLabel option={option} />}
          onCheckedChange={(checked) =>
            filter.setValue(
              (prev = []) =>
                checked
                  ? [...prev, option.value]
                  : prev.filter((value) => value !== option.value),
              {labels: {[option.value]: option.label}},
            )
          }
          size={qdsContext.size}
        />
      ))}
    </PolymorphicElement>
  )
}
