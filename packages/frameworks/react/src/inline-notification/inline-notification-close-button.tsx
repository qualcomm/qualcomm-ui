// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {X} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import {useInlineNotificationCloseTrigger} from "@qualcomm-ui/react-core/inline-notification"
import type {ElementRenderProp, IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsInlineNotificationContext} from "./qds-inline-notification-context"

export interface InlineNotificationCloseButtonProps
  extends IdProp,
    ElementRenderProp<"button"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Closes the notification when clicked. Renders a `<button>` element by default.
 */
export function InlineNotificationCloseButton({
  children,
  id,
  ...props
}: InlineNotificationCloseButtonProps): ReactElement {
  const buttonProps = useInlineNotificationCloseTrigger({id})
  const qdsContext = useQdsInlineNotificationContext()

  const mergedProps = mergeProps(
    buttonProps,
    qdsContext.getCloseButtonBindings(),
    props,
  )

  return (
    <InlineIconButton icon={X} size="md" {...mergedProps}>
      {children}
    </InlineIconButton>
  )
}
