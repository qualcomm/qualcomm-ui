// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {useFilterSetContext} from "@qualcomm-ui/react-core/filter-set"
import {useOverflowListContext} from "@qualcomm-ui/react-core/overflow-list"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useQdsTableRootContext} from "@qualcomm-ui/react/table"
import {Tag} from "@qualcomm-ui/react/tag"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TableFilterBarFilterListProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * Rendered after the applied filters' tags. Render the
   * `TableFilterBar.ExpandTrigger` here so that it follows the last visible
   * tag.
   */
  children?: ReactNode
}

/**
 * Lists the applied filters as dismissable tags, followed by its children.
 * Clamped to a single row unless the filter bar is expanded. Renders a `<div>`
 * element by default.
 */
export function TableFilterBarFilterList({
  children,
  id,
  ...props
}: TableFilterBarFilterListProps): ReactElement {
  const qdsContext = useQdsTableRootContext()
  const filterSet = useFilterSetContext()
  const overflowList = useOverflowListContext()

  const mergedProps = mergeProps(
    overflowList.getRootBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    qdsContext.getFilterBarFilterListBindings({
      expanded: overflowList.expanded,
    }),
    props,
  )

  const tagProps = qdsContext.getFilterBarTagProps()

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {filterSet.getValueItems().map((item, index) => {
        const text = `${filterSet.getFilterLabel(item.filterId)}: ${item.label}`
        return (
          <Tag
            key={`${item.filterId}:${item.value}`}
            {...tagProps}
            {...overflowList.getItemBindings({index})}
            dismissLabel={`Remove ${text}`}
            onDismiss={() =>
              filterSet.removeFilterValue(item.filterId, item.value)
            }
          >
            {text}
          </Tag>
        )
      })}
      {children}
    </PolymorphicElement>
  )
}
