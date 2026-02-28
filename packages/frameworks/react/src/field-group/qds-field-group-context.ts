// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsFieldGroupApi} from "@qualcomm-ui/qds-core/field-group"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsFieldGroupContextProvider, useQdsFieldGroupContext] =
  createGuardedContext<QdsFieldGroupApi>({
    hookName: "useQdsFieldGroupContext",
    providerName: "<QdsFieldGroupContextProvider>",
    strict: false,
  })
