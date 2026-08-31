// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {
  DatePickerApiPresetTriggerProps,
  DatePickerPresetTriggerValue,
} from "@qualcomm-ui/core/date-picker"

import {useDatePickerContext} from "./date-picker-context.service"

@Directive()
export class CoreDatePickerPresetTriggerDirective
  implements SignalifyInput<DatePickerApiPresetTriggerProps>, OnInit
{
  /**
   * The value applied when the preset is selected. Either a named range preset
   * (e.g. `"next7Days"`) or an explicit array of dates.
   */
  readonly value = input.required<DatePickerPresetTriggerValue>()

  protected readonly datePickerContext = useDatePickerContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.datePickerContext().getPresetTriggerBindings({value: this.value()}),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
