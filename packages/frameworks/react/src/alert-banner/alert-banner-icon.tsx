// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  BellRing,
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
} from "lucide-react"

import type {QdsAlertBannerEmphasis} from "@qualcomm-ui/qds-core/alert-banner"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useAlertBannerContext} from "./qds-alert-banner-context.js"

export interface AlertBannerIconProps extends ElementRenderProp<"span"> {
  /**
   * Override the icon displayed in the banner. When this prop is omitted,
   * the icon is determined by the {@link emphasis} prop.
   */
  icon?: LucideIconOrNode
}

/**
 * An icon that indicates the banner's status. Renders a `<span>` element by
 * default.
 */
export function AlertBannerIcon({
  icon: iconProp,
  ...props
}: AlertBannerIconProps): ReactElement {
  const context = useAlertBannerContext()
  const mergedProps = mergeProps(context.getIconBindings(), props)

  return (
    <IconOrNode
      icon={iconProp || icons[context.emphasis] || Info}
      size="lg"
      {...mergedProps}
    />
  )
}

const icons: Record<QdsAlertBannerEmphasis, LucideIconOrNode> = {
  danger: CircleAlert,
  info: Info,
  neutral: BellRing,
  success: CircleCheck,
  warning: TriangleAlert,
}
