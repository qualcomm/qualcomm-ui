// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {DatePickerApi} from "@qualcomm-ui/core/date-picker"

const [DatePickerContextProvider, useDatePickerContext] =
  createGuardedContext<DatePickerApi>({
    hookName: "useDatePickerContext",
    providerName: "<DatePickerContextProvider>",
    strict: true,
  })

export {DatePickerContextProvider, useDatePickerContext}
