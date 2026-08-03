// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {DatePickerDateView} from "@qualcomm-ui/core/date-picker"

import {
  useDatePickerContext,
  useDatePickerViewContext,
} from "./date-picker-context.service"

@Directive()
export class CoreDatePickerViewTriggerDirective implements OnInit {
  /**
   * Switch directly to this view when activated. When omitted, the trigger
   * toggles to the next view.
   */
  readonly view = input<DatePickerDateView | undefined>()

  protected readonly datePickerContext = useDatePickerContext()
  protected readonly viewContext = useDatePickerViewContext()

  protected readonly coreBindings = computed(() =>
    this.datePickerContext().getViewTriggerBindings({
      goToView: this.view(),
      view: this.viewContext().view,
    }),
  )

  protected readonly trackBindings = useTrackBindings(() => this.coreBindings())

  ngOnInit() {
    this.trackBindings()
  }
}
