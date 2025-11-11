// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {BellRing, CircleAlert, CircleCheck, TriangleAlert} from "lucide-react"

import type {QdsNotificationEmphasis} from "@qualcomm-ui/qds-core/inline-notification"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsToastContext} from "./qds-toast-context"

export interface ToastIconProps extends ElementRenderProp<"span"> {
  /**
   * Override the icon displayed in the notification. When this prop is omitted,
   * the icon is determined by the {@link emphasis} prop.
   */
  icon?: LucideIconOrNode
}

export function ToastIcon({
  icon: iconProp,
  ...props
}: ToastIconProps): ReactElement {
  const qdsContext = useQdsToastContext()

  const mergedProps = mergeProps(qdsContext.getIconBindings(), props)

  return (
    <IconOrNode
      icon={iconProp || icons[qdsContext.emphasis] || CircleAlert}
      size="lg"
      {...mergedProps}
    />
  )
}

const icons: Record<QdsNotificationEmphasis, LucideIconOrNode> = {
  danger: CircleAlert,
  info: CircleAlert,
  loading: <ProgressRing size="xs" />,
  neutral: BellRing,
  success: CircleCheck,
  warning: TriangleAlert,
}
