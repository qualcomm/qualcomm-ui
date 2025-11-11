// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {UnfoldHorizontal} from "lucide-react"

import type {QdsTableColumnResizerProps} from "@qualcomm-ui/qds-core/table"
import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableColumnDragHandleProps
  extends Omit<ElementRenderProp<"button">, "children">,
    QdsTableColumnResizerProps {
  /**
   * Lucide icon to display inside the button.
   *
   * @default UnfoldHorizontal
   */
  icon?: LucideIconOrNode
}

/**
 * A handle button for resizing columns. Renders a `<button>` element by default.
 */
export function TableColumnResizeHandle({
  header,
  ...props
}: TableColumnDragHandleProps): ReactElement {
  const mergedProps = mergeProps(
    qdsTableApi.getColumnResizerBindings({header}),
    props,
  )

  return (
    <InlineIconButton
      icon={UnfoldHorizontal}
      size="sm"
      variant="fixed"
      {...mergedProps}
    />
  )
}
