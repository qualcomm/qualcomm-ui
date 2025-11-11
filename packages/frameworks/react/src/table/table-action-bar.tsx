// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableActionBarProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Container for action buttons, filters, and other controls displayed at the top
 * of the table. Renders a `<div>` element by default.
 *
 * @example
 * ```tsx
 * <Table.Root>
 *   <Table.ActionBar>
 *     ...
 *   </Table.ActionBar>
 *   <Table.ScrollContainer>
 *     <Table.Table>...</Table.Table>
 *   </Table.ScrollContainer>
 * </Table.Root>
 * ```
 */
export function TableActionBar({
  children,
  ...props
}: TableActionBarProps): ReactElement {
  const mergedProps = mergeProps(qdsTableApi.getActionBarBindings(), props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
