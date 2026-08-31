// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {
  DatePickerDateView,
  DatePickerApiViewProps,
} from "@qualcomm-ui/core/date-picker"

import {
  useDatePickerContext,
  useDatePickerViewContext,
} from "./date-picker-context.service"

@Directive()
export class CoreDatePickerPrevTriggerDirective
  implements SignalifyInput<DatePickerApiViewProps>, OnInit
{
  /**
   * The view to page. Defaults to the enclosing `View`.
   */
  readonly view = input<DatePickerDateView | undefined>()

  protected readonly datePickerContext = useDatePickerContext()
  protected readonly viewContext = useDatePickerViewContext()

  protected readonly coreBindings = computed(() =>
    this.datePickerContext().getPrevTriggerBindings({
      view: this.view() ?? this.viewContext().view,
    }),
  )

  protected readonly trackBindings = useTrackBindings(() => this.coreBindings())

  ngOnInit() {
    this.trackBindings()
  }
}
