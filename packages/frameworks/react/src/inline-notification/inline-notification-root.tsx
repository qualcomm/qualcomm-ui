// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  createQdsInlineNotificationApi,
  type QdsNotificationApiProps,
} from "@qualcomm-ui/qds-core/inline-notification"
import {
  CoreInlineNotification,
  type CoreInlineNotificationRootProps,
} from "@qualcomm-ui/react-core/inline-notification"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsInlineNotificationContextProvider} from "./qds-inline-notification-context"

export interface InlineNotificationRootProps
  extends CoreInlineNotificationRootProps,
    QdsNotificationApiProps {}

/**
 * Groups all parts of the notification. Renders a `<div>` element by default.
 */
export function InlineNotificationRoot({
  children,
  emphasis,
  orientation,
  ...props
}: InlineNotificationRootProps): ReactElement {
  const qdsContext = useMemo(
    () =>
      createQdsInlineNotificationApi(
        {
          emphasis,
          orientation,
        },
        normalizeProps,
      ),
    [emphasis, orientation],
  )

  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)

  return (
    <QdsInlineNotificationContextProvider value={qdsContext}>
      <CoreInlineNotification.Root {...mergedProps}>
        {children}
      </CoreInlineNotification.Root>
    </QdsInlineNotificationContextProvider>
  )
}
