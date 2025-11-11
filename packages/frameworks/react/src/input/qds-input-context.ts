// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsInputApi, QdsInputApiProps} from "@qualcomm-ui/qds-core/input"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"

export interface QdsReactInputApiProps
  extends QdsInputApiProps<LucideIconOrElement> {}

export interface QdsReactInputApi extends QdsInputApi<LucideIconOrElement> {}

export const [QdsInputContextProvider, useQdsInputContext] =
  createGuardedContext<QdsReactInputApi>({
    hookName: "useQdsInputContext",
    providerName: "<QdsInputContextProvider>",
    strict: true,
  })
