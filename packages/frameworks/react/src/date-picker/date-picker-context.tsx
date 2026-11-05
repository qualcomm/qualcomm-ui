// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {
  CoreDatePicker,
  type CoreDatePickerContextProps,
} from "@qualcomm-ui/react-core/date-picker"

export interface DatePickerContextProps extends CoreDatePickerContextProps {}

/**
 * Exposes the date picker API to descendants through a render prop.
 */
export function DatePickerContext(props: DatePickerContextProps): ReactNode {
  return <CoreDatePicker.Context {...props} />
}
