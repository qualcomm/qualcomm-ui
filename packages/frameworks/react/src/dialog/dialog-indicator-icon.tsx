// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CircleAlert, CircleCheck, TriangleAlert} from "lucide-react"

import type {QdsDialogEmphasis} from "@qualcomm-ui/qds-core/dialog"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDialogContext} from "./qds-dialog-context"

export interface DialogIndicatorIconProps extends ElementRenderProp<"span"> {
  /**
   * Lucide-react icon or React Element. If this prop is omitted, a fallback icon
   * will be rendered based on the {@link emphasis} prop.
   */
  icon?: LucideIconOrElement
}

/**
 * An icon that indicates the dialog's status. Renders a `<span>` element by default.
 */
export function DialogIndicatorIcon(
  props: DialogIndicatorIconProps,
): ReactElement {
  const qdsContext = useQdsDialogContext()

  const mergedProps = mergeProps(qdsContext.getIndicatorIconBindings(), props)

  return (
    <IconOrNode
      {...mergedProps}
      icon={props.icon || getIconFromEmphasis(qdsContext.emphasis)}
    />
  )
}

function getIconFromEmphasis(emphasis: QdsDialogEmphasis) {
  switch (emphasis) {
    case "neutral":
      return CircleAlert
    case "info":
      return CircleAlert
    case "success":
      return CircleCheck
    case "warning":
      return TriangleAlert
    case "danger":
      return CircleAlert
  }
}
