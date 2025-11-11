// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableScrollContainerProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A scrollable container that wraps the table element. Renders a `<div>` element by
 * default.
 *
 * @example
 * ```tsx
 * <Table.Root>
 *   <Table.ScrollContainer>
 *     <Table.Table>
 *       <Table.Header>...</Table.Header>
 *       <Table.Body>...</Table.Body>
 *     </Table.Table>
 *   </Table.ScrollContainer>
 * </Table.Root>
 * ```
 */
export function TableScrollContainer({
  children,
  ...props
}: TableScrollContainerProps): ReactElement {
  const mergedProps = mergeProps(
    qdsTableApi.getScrollContainerBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
