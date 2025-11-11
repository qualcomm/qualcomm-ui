// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {GripVertical} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableColumnDragHandleProps
  extends Omit<ElementRenderProp<"button">, "children"> {
  /**
   * Lucide icon to display inside the button.
   *
   * @default GripVertical
   */
  icon?: LucideIconOrNode
}

/**
 * A drag handle button for reordering columns via drag-and-drop. Renders a
 * `<button>` element by default.
 */
export function TableColumnDragHandle(
  props: TableColumnDragHandleProps,
): ReactElement {
  const mergedProps = mergeProps(qdsTableApi.getDragHandleBindings(), props)

  return (
    <InlineIconButton
      icon={GripVertical}
      size="sm"
      variant="fixed"
      {...mergedProps}
    />
  )
}
