// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsListboxApi} from "@qualcomm-ui/qds-core/listbox"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsListboxContextProvider, useQdsListboxContext] =
  createGuardedContext<QdsListboxApi>({
    hookName: "useQdsListboxContext",
    providerName: "<QdsListboxContextProvider>",
    strict: true,
  })
