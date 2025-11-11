// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {QdsTableRowDropIndicatorProps} from "@qualcomm-ui/qds-core/table"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableRowDropIndicatorProps
  extends Omit<ElementRenderProp<"div">, "children">,
    QdsTableRowDropIndicatorProps {}

/**
 * Visual indicator displayed when a row is being dragged over a drop zone. Renders
 * a `<div>` element by default.
 */
export function TableRowDropIndicator({
  closestEdge,
  rowIndex,
  sourceIndex,
  ...props
}: TableRowDropIndicatorProps): ReactElement {
  const mergedProps = mergeProps(
    qdsTableApi.getRowDropIndicatorBindings({
      closestEdge,
      rowIndex,
      sourceIndex,
    }),
    props,
  )
  return <PolymorphicElement as="div" {...mergedProps} />
}
