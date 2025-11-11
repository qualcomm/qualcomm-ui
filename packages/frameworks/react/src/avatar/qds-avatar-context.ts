// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsAvatarApi} from "@qualcomm-ui/qds-core/avatar"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsAvatarContextProvider, useQdsAvatarContext] =
  createGuardedContext<QdsAvatarApi>({
    hookName: "useQdsAvatarContext",
    providerName: "<QdsAvatarContextProvider>",
    strict: true,
  })
