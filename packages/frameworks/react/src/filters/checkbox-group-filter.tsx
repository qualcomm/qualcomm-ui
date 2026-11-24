// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {createCheckboxGroupFilterApi} from "@qualcomm-ui/core/filter-control"
import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {useFilter} from "@qualcomm-ui/react-core/filter-set"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Checkbox} from "@qualcomm-ui/react/checkbox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {FilterOptionLabel} from "./internal/filter-option-label.js"
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
  const api = createCheckboxGroupFilterApi(
    useFilter<ListFilterDefinition>(),
    normalizeProps,
  )
  const qdsContext = useQdsFilterControlContext()

  if (!api.options) {
    return null
  }

  const mergedProps = mergeProps(
    api.getRootBindings(),
    qdsContext.getOptionGroupBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {api.options.map((option) => (
        <Checkbox
          key={option.value}
          checked={option.checked}
          disabled={option.disabled}
          label={
            <FilterOptionLabel count={option.count} label={option.label} />
          }
          onCheckedChange={option.setChecked}
          size={qdsContext.size}
        />
      ))}
    </PolymorphicElement>
  )
}
