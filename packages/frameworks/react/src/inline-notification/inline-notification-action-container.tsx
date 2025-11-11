// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useInlineNotificationContext} from "@qualcomm-ui/react-core/inline-notification"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsInlineNotificationContext} from "./qds-inline-notification-context"

export interface InlineNotificationActionContainerProps
  extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A container for the notification's primary action button. Renders a `<div>`
 * element by default.
 */
export function InlineNotificationActionContainer({
  children,
  ...props
}: InlineNotificationActionContainerProps): ReactElement {
  const context = useInlineNotificationContext()
  const qdsContext = useQdsInlineNotificationContext()

  const mergedProps = mergeProps(
    context.getActionBindings(),
    qdsContext.getActionBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
