// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {SegmentedControlApi} from "@qualcomm-ui/core/segmented-control"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [SegmentedControlContextProvider, useSegmentedControlContext] =
  createGuardedContext<SegmentedControlApi>({
    hookName: "useSegmentedControlContext",
    providerName: "<SegmentedControlContextProvider>",
    strict: true,
  })
