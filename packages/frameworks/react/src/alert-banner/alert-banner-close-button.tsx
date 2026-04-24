// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {X} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useAlertBannerContext} from "./qds-alert-banner-context"

export interface AlertBannerCloseButtonProps extends ElementRenderProp<"button"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Calls the root's `onClose` when clicked. Renders a `<button>` element by default.
 */
export function AlertBannerCloseButton({
  children,
  ...props
}: AlertBannerCloseButtonProps): ReactElement {
  const context = useAlertBannerContext()

  const mergedProps = mergeProps(
    {onClick: context.onClose},
    context.getCloseButtonBindings(),
    props,
  )

  return (
    <IconButton
      density="compact"
      emphasis={context.closeButtonEmphasis}
      icon={X}
      size="md"
      variant="ghost"
      {...mergedProps}
    >
      {children}
    </IconButton>
  )
}
