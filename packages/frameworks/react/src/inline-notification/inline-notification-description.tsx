// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {CoreInlineNotification} from "@qualcomm-ui/react-core/inline-notification"
import type {ElementRenderProp, IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsInlineNotificationContext} from "./qds-inline-notification-context"

export interface InlineNotificationDescriptionProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A paragraph with additional information about the notification. Renders a `<div>`
 * element by default.
 */
export function InlineNotificationDescription(
  props: InlineNotificationDescriptionProps,
): ReactElement {
  const qdsContext = useQdsInlineNotificationContext()
  const mergedProps = mergeProps(qdsContext.getDescriptionBindings(), props)

  return <CoreInlineNotification.Description {...mergedProps} />
}
