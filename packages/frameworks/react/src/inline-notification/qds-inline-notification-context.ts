// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsNotificationApi} from "@qualcomm-ui/qds-core/inline-notification"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [
  QdsInlineNotificationContextProvider,
  useQdsInlineNotificationContext,
] = createGuardedContext<QdsNotificationApi>({
  hookName: "useQdsInlineNotificationContext",
  providerName: "<QdsInlineNotificationContextProvider>",
  strict: true,
})
