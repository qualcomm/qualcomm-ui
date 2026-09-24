// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsDatePickerApi} from "@qualcomm-ui/qds-core/date-picker"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsDatePickerContextProvider, useQdsDatePickerContext] =
  createGuardedContext<QdsDatePickerApi>({
    hookName: "useQdsDatePickerContext",
    providerName: "<QdsDatePickerContextProvider>",
    strict: true,
  })
