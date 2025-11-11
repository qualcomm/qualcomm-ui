// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsSliderApi} from "@qualcomm-ui/qds-core/slider"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsSliderContextProvider, useQdsSliderContext] =
  createGuardedContext<QdsSliderApi>({
    hookName: "useQdsSliderContext",
    providerName: "<QdsSliderContextProvider>",
    strict: true,
  })
