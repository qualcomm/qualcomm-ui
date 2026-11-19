// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {useFilterSetContext} from "@qualcomm-ui/react-core/filter-set"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Checkbox} from "@qualcomm-ui/react/checkbox"
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

export interface CheckboxGroupFilterProps
  extends
    Omit<ElementRenderProp<"div">, "children">,
    FilterCollectionStatusTextProps {}

/**
 * A group of checkboxes, one per item of the filter's list collection. Selects
 * any number of items. Writes a `string[]`. Renders a `<div>` element by
 * default.
 */
export function CheckboxGroupFilter({
  loadErrorText,
  loadingText,
  retryLabel,
  ...props
}: CheckboxGroupFilterProps): ReactElement {
  const filter = useFilterWidget<ListFilterDefinition>(
    "CheckboxGroupFilter",
    "list",
  )
  const api = useFilterSetContext()
  const qdsContext = useQdsFilterControlContext()
  const options = api.getFilterOptions(filter.id)
  const selected = filter.value ?? []

  const mergedProps = mergeProps(
    qdsContext.getOptionGroupBindings(),
    {
      ...getFilterLabelProps(filter),
      "aria-busy": filter.collectionState?.status === "loading" || undefined,
      role: "group",
    },
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <FilterCollectionStatus
        loadErrorText={loadErrorText}
        loadingText={loadingText}
        retryLabel={retryLabel}
        state={filter.collectionState}
      />
      {options.map((option) => (
        <Checkbox
          key={option.value}
          checked={selected.includes(option.value)}
          disabled={option.disabled}
          label={<FilterOptionLabel option={option} />}
          onCheckedChange={(checked) =>
            filter.setValue((prev = []) =>
              checked
                ? [...prev, option.value]
                : prev.filter((value) => value !== option.value),
            )
          }
          size={qdsContext.size}
        />
      ))}
    </PolymorphicElement>
  )
}
