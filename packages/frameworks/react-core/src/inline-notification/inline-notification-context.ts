// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {InlineNotificationApi} from "@qualcomm-ui/core/inline-notification"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [InlineNotificationContextProvider, useInlineNotificationContext] =
  createGuardedContext<InlineNotificationApi>({
    hookName: "useInlineNotificationContext",
    providerName: "<InlineNotificationContextProvider>",
    strict: true,
  })
