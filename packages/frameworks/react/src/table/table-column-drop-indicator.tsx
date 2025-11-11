// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {QdsTableColumnDropIndicatorProps} from "@qualcomm-ui/qds-core/table"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableColumnDropIndicatorProps
  extends Omit<ElementRenderProp<"div">, "children">,
    QdsTableColumnDropIndicatorProps {}

/**
 * Visual indicator displayed when a column is being dragged over a drop zone.
 * Renders a `<div>` element by default.
 */
export function TableColumnDropIndicator({
  closestEdge,
  columnIndex,
  sourceColumnIndex,
  ...props
}: TableColumnDropIndicatorProps): ReactElement {
  const mergedProps = mergeProps(
    qdsTableApi.getColumnDropIndicatorBindings({
      closestEdge,
      columnIndex,
      sourceColumnIndex,
    }),
    props,
  )
  return <PolymorphicElement as="div" {...mergedProps} />
}
