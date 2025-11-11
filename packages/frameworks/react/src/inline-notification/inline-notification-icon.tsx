// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {BellRing, CircleAlert, CircleCheck, TriangleAlert} from "lucide-react"

import type {QdsNotificationEmphasis} from "@qualcomm-ui/qds-core/inline-notification"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {useInlineNotificationContext} from "@qualcomm-ui/react-core/inline-notification"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsInlineNotificationContext} from "./qds-inline-notification-context"

export interface InlineNotificationIconProps extends ElementRenderProp<"span"> {
  /**
   * Override the icon displayed in the notification. When this prop is omitted,
   * the icon is determined by the {@link emphasis} prop.
   */
  icon?: LucideIconOrNode
}

/**
 * An icon that indicates the notification's status. Renders a `<span>` element by
 * default.
 */
export function InlineNotificationIcon({
  icon: iconProp,
  ...props
}: InlineNotificationIconProps): ReactElement {
  const context = useInlineNotificationContext()
  const qdsContext = useQdsInlineNotificationContext()

  const mergedProps = mergeProps(
    context.getIconBindings(),
    qdsContext.getIconBindings(),
    props,
  )

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
  loading: <ProgressRing />,
  neutral: BellRing,
  success: CircleCheck,
  warning: TriangleAlert,
}
