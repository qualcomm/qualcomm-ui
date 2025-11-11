// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronRight} from "lucide-react"

import type {QdsTableRowExpandButtonProps} from "@qualcomm-ui/qds-core/table"
import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableRowExpandButtonProps
  extends ElementRenderProp<"button">,
    QdsTableRowExpandButtonProps {}

/**
 * A button for expanding and collapsing nested rows. Automatically displays the
 * appropriate icon based on the row's expansion state. Renders a `<button>` element
 * by default.
 */
export function TableRowExpandButton({
  row,
  ...props
}: TableRowExpandButtonProps): ReactElement {
  const mergedProps = mergeProps(
    qdsTableApi.getRowExpandButtonBindings({row}),
    props,
  )

  return (
    <InlineIconButton
      icon={ChevronRight}
      size="sm"
      variant="fixed"
      {...mergedProps}
    />
  )
}
