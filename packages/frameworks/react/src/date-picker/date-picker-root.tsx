// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  createQdsDatePickerApi,
  type QdsDatePickerApiProps,
} from "@qualcomm-ui/qds-core/date-picker"
import {
  CoreDatePicker,
  type CoreDatePickerRootProps,
} from "@qualcomm-ui/react-core/date-picker"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsDatePickerContextProvider} from "./qds-date-picker-context.js"

export interface DatePickerRootProps
  extends CoreDatePickerRootProps, QdsDatePickerApiProps {}

/**
 * Groups all parts of the date picker. Renders a `<div>` element by default.
 */
export function DatePickerRoot({
  hideOutsideDays,
  size,
  ...props
}: DatePickerRootProps): ReactElement {
  const qdsApi = useMemo(
    () => createQdsDatePickerApi({hideOutsideDays, size}, normalizeProps),
    [hideOutsideDays, size],
  )

  const mergedProps = mergeProps(qdsApi.getRootBindings(), props)

  return (
    <QdsDatePickerContextProvider value={qdsApi}>
      <CoreDatePicker.Root {...mergedProps} />
    </QdsDatePickerContextProvider>
  )
}
