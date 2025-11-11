// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Filter} from "lucide-react"

import type {QdsTableColumnFilterProps} from "@qualcomm-ui/qds-core/table"
import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableColumnFilterActionProps
  extends Omit<ElementRenderProp<"button">, "children">,
    QdsTableColumnFilterProps {
  /**
   * Lucide icon to display inside the button.
   *
   * @default Filter
   */
  icon?: LucideIconOrNode
}

/**
 * An action button for opening a column filter menu or interface. Renders a
 * `<button>` element by default.
 */
export function TableColumnFilterAction({
  header,
  ...props
}: TableColumnFilterActionProps): ReactElement | null {
  const canFilter = header.column.getCanFilter()

  if (!canFilter) {
    return null
  }

  const mergedProps = mergeProps(
    qdsTableApi.getColumnFilterActionBindings({header}),
    props,
  )

  return (
    <InlineIconButton
      icon={Filter}
      size="sm"
      variant="fixed"
      {...mergedProps}
    />
  )
}
