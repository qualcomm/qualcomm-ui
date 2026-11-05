// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {
  DatePickerDateView,
  DatePickerApiViewProps,
} from "@qualcomm-ui/core/date-picker"

import {
  DatePickerViewContextService,
  useDatePickerContext,
} from "./date-picker-context.service"

@Directive()
export class CoreDatePickerViewDirective
  implements SignalifyInput<DatePickerApiViewProps>, OnInit
{
  /**
   * The calendar view this element renders.
   *
   * @default 'day'
   */
  readonly view = input<DatePickerDateView | undefined>()

  protected readonly datePickerContext = useDatePickerContext()
  protected readonly viewContextService = inject(DatePickerViewContextService)

  protected readonly trackBindings = useTrackBindings(() =>
    this.datePickerContext().getViewBindings(this.viewContextService.context()),
  )

  ngOnInit() {
    this.viewContextService.init(computed(() => ({view: this.view()})))
    this.trackBindings()
  }
}
