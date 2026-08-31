// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {
  useDatePickerContext,
  useDatePickerViewContext,
} from "./date-picker-context.service"

@Directive()
export class CoreDatePickerViewControlDirective implements OnInit {
  protected readonly datePickerContext = useDatePickerContext()
  protected readonly viewContext = useDatePickerViewContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.datePickerContext().getViewControlBindings(this.viewContext()),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
