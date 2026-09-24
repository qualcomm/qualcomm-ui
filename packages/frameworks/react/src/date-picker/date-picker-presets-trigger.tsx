// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {EllipsisVertical, X} from "lucide-react"

import {
  CoreDatePicker,
  type CoreDatePickerPresetsTriggerProps,
  useDatePickerContext,
} from "@qualcomm-ui/react-core/date-picker"
import {IconButton} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

export interface DatePickerPresetsTriggerProps extends CoreDatePickerPresetsTriggerProps {}

/**
 * Toggles the {@link DatePickerPresets} panel. Styled as an outline
 * {@link IconButton} that becomes a close affordance while the panel is open.
 */
export function DatePickerPresetsTrigger({
  render,
  ...props
}: DatePickerPresetsTriggerProps): ReactElement {
  const qdsContext = useQdsDatePickerContext()
  const {presetsOpen} = useDatePickerContext()
  const mergedProps = mergeProps(qdsContext.getPresetsTriggerBindings(), props)

  return (
    <CoreDatePicker.PresetsTrigger
      {...mergedProps}
      render={
        <IconButton
          density="compact"
          emphasis={presetsOpen ? "neutral" : "primary"}
          icon={presetsOpen ? X : EllipsisVertical}
          render={render}
          shape={presetsOpen ? "square" : "rounded"}
          size="sm"
          variant="outline"
        />
      }
    />
  )
}
