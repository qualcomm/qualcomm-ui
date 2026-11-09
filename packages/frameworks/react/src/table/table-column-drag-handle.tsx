// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {GripVertical} from "lucide-react"

import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {IconButton} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context.js"

export interface TableColumnDragHandleProps extends Omit<
  ElementRenderProp<"button">,
  "children"
> {
  /**
   * Lucide icon to display inside the button.
   *
   * @default GripVertical
   */
  icon?: LucideIconOrElement
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
    <IconButton
      density="compact"
      icon={GripVertical}
      size="sm"
      variant="ghost"
      {...mergedProps}
    />
  )
}
