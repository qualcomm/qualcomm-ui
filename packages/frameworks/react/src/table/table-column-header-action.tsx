// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableColumnHeaderActionProps
  extends Omit<ElementRenderProp<"button">, "children"> {
  /**
   * Lucide icon to display inside the button.
   */
  icon: LucideIconOrNode
}

/**
 * A general-purpose action button within a column header. Renders a `<button>`
 * element by default.
 */
export function TableColumnHeaderAction(
  props: TableColumnHeaderActionProps,
): ReactElement {
  const mergedProps = mergeProps(
    qdsTableApi.getColumnHeaderActionBindings(),
    props,
  )

  return <InlineIconButton size="sm" variant="fixed" {...mergedProps} />
}
