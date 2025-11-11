// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createGuardedContext} from "@qualcomm-ui/react-core/context"

import type {UsePresenceReturn} from "./use-presence"

export const [PresenceContextProvider, usePresenceContext] =
  createGuardedContext<UsePresenceReturn>({
    hookName: "usePresenceContext",
    providerName: "<PresenceContextProvider>",
    strict: true,
  })
