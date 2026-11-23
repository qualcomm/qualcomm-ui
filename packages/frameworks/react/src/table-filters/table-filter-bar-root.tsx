// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useFilterSetContext} from "@qualcomm-ui/react-core/filter-set"
import {
  OverflowListContextProvider,
  useOverflowList,
} from "@qualcomm-ui/react-core/overflow-list"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {ButtonPropsContextProvider} from "@qualcomm-ui/react/button"
import {useQdsTableRootContext} from "@qualcomm-ui/react/table"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TableFilterBarRootProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * The initial expanded state. Use when you don't need to control the
   * expanded state.
   *
   * @default false
   */
  defaultExpanded?: boolean

  /**
   * The controlled expanded state. When `false`, the applied filters are
   * clamped to a single row.
   */
  expanded?: boolean

  /**
   * Called when the expanded state changes.
   */
  onExpandedChange?: (expanded: boolean) => void
}

/**
 * The root element of the filter bar. Must be rendered within a `Table.Root`
 * and a filter set, such as a `FilterSetProvider`. Renders nothing while no
 * filters are applied. Otherwise renders a `<div>` element by default.
 */
export function TableFilterBarRoot({
  children,
  defaultExpanded,
  expanded,
  onExpandedChange,
  ...props
}: TableFilterBarRootProps): ReactElement | null {
  const qdsContext = useQdsTableRootContext()
  const filterSet = useFilterSetContext()
  const overflowList = useOverflowList({
    count: filterSet.getValueItems().length,
    defaultExpanded,
    expanded,
    onExpandedChange,
  })

  if (filterSet.valueCount === 0) {
    return null
  }

  const mergedProps = mergeProps(qdsContext.getFilterBarBindings(), props)

  return (
    <OverflowListContextProvider value={overflowList}>
      <ButtonPropsContextProvider value={qdsContext.getFilterBarButtonProps()}>
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </ButtonPropsContextProvider>
    </OverflowListContextProvider>
  )
}
