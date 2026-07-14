// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TourApi} from "@qualcomm-ui/core/tour"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [TourContextProvider, useTourContext] =
  createGuardedContext<TourApi>({
    hookName: "useTourContext",
    providerName: "<TourContextProvider>",
    strict: true,
  })
