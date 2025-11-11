// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PasswordInputApi} from "@qualcomm-ui/core/password-input"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [PasswordInputContextProvider, usePasswordInputContext] =
  createGuardedContext<PasswordInputApi>({
    hookName: "usePasswordInputContext",
    providerName: "<PasswordInputContextProvider>",
    strict: true,
  })
