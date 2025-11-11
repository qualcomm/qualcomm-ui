// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsSegmentedControlApi} from "@qualcomm-ui/qds-core/segmented-control"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [
  QdsSegmentedControlContextProvider,
  useQdsSegmentedControlContext,
] = createGuardedContext<QdsSegmentedControlApi>({
  hookName: "useQdsSegmentedControlContext",
  providerName: "<QdsSegmentedControlContextProvider>",
  strict: true,
})
