// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input, numberAttribute, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {DatePickerApiLabelProps} from "@qualcomm-ui/core/date-picker"

import {useDatePickerContext} from "./date-picker-context.service"

@Directive()
export class CoreDatePickerLabelDirective
  implements SignalifyInput<DatePickerApiLabelProps>, OnInit
{
  /**
   * The index of the input this label describes. Range pickers render one input
   * per boundary, `0` for the start date and `1` for the end date.
   */
  readonly index = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  })

  protected readonly datePickerContext = useDatePickerContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.datePickerContext().getLabelBindings({index: this.index()}),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
