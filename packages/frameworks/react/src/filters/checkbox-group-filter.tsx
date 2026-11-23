// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {ListCollection} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {FilterOptionLabel} from "./internal/filter-option-label.js"
import {getOptionCount} from "./internal/get-option-count.js"
import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface CheckboxGroupFilterProps extends Omit<
  ElementRenderProp<"div">,
  "children"
> {}

/**
 * A group of checkboxes, one per item of the filter's list collection. Selects
 * any number of items. Writes a `string[]`. Renders a `<div>` element by
 * default. Renders nothing while the filter has no collection.
 */
export function CheckboxGroupFilter(
  props: CheckboxGroupFilterProps,
): ReactElement | null {
  const filter = useFilterWidget<ListFilterDefinition>(
    "CheckboxGroupFilter",
    "list",
  )
  const qdsContext = useQdsFilterControlContext()
  const collection =
    filter.collection instanceof ListCollection ? filter.collection : undefined

  if (!collection) {
    return null
  }

  const selected = filter.value ?? []

  const mergedProps = mergeProps(
    qdsContext.getOptionGroupBindings(),
    {...getFilterLabelProps(filter), role: "group"},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {collection.items.map((item) => {
        const value = collection.getItemValue(item)
        if (value === null) {
          return null
        }
        const count = getOptionCount(filter.optionCounts, value)
        const checked = selected.includes(value)
        return (
          <Checkbox
            key={value}
            checked={checked}
            disabled={
              !checked && (!!collection.getItemDisabled(item) || count === 0)
            }
            label={
              <FilterOptionLabel
                count={count}
                label={collection.stringifyItem(item) ?? value}
              />
            }
            onCheckedChange={(next) =>
              filter.setValue((prev = []) =>
                next
                  ? [...prev, value]
                  : prev.filter((option) => option !== value),
              )
            }
            size={qdsContext.size}
          />
        )
      })}
    </PolymorphicElement>
  )
}
