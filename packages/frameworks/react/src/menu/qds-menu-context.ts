// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsMenuApi} from "@qualcomm-ui/qds-core/menu"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsMenuContextProvider, useQdsMenuContext] =
  createGuardedContext<QdsMenuApi>({
    hookName: "useQdsMenuContext",
    providerName: "<QdsMenuContextProvider>",
    strict: true,
  })
