// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TabProps} from "@qualcomm-ui/core/tabs"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [TabPropsContextProvider, useTabPropsContext] =
  createGuardedContext<TabProps>({
    hookName: "useTabPropContext",
    providerName: "<TabPropContextProvider>",
    strict: true,
  })
