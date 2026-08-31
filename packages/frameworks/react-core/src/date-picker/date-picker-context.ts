// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  DatePickerApi,
  DatePickerApiDayTableCellProps,
  DatePickerApiTableCellProps,
  DatePickerApiTableProps,
  DatePickerApiViewProps,
} from "@qualcomm-ui/core/date-picker"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [DatePickerContextProvider, useDatePickerContext] =
  createGuardedContext<DatePickerApi>({
    hookName: "useDatePickerContext",
    providerName: "<DatePickerContextProvider>",
    strict: true,
  })

export const [DatePickerViewContextProvider, useDatePickerViewContext] =
  createGuardedContext<DatePickerApiViewProps>({
    defaultValue: {view: "day"},
    hookName: "useDatePickerViewContext",
    providerName: "<DatePickerViewContextProvider>",
    strict: true,
  })

export const [DatePickerTableContextProvider, useDatePickerTableContext] =
  createGuardedContext<DatePickerApiTableProps>({
    hookName: "useDatePickerTableContext",
    providerName: "<DatePickerTableContextProvider>",
    strict: true,
  })

export const [
  DatePickerTableCellContextProvider,
  useDatePickerTableCellContext,
] = createGuardedContext<
  DatePickerApiDayTableCellProps | DatePickerApiTableCellProps
>({
  hookName: "useDatePickerTableCellContext",
  providerName: "<DatePickerTableCellContextProvider>",
  strict: true,
})
