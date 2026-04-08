// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createRequiredContext} from "@qualcomm-ui/react-core/context"
import type {DatePickerApi} from "@qualcomm-ui/core/date-picker"

const [DatePickerContextProvider, useDatePickerContext] =
  createRequiredContext<DatePickerApi>(
    "DatePickerContext",
    "@qualcomm-ui/react-core/date-picker",
  )

export {DatePickerContextProvider, useDatePickerContext}
