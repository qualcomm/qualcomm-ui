// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {
  useDatePickerContext,
  useDatePickerTableContext,
} from "./date-picker-context.service"

@Directive()
export class CoreDatePickerTableBodyDirective implements OnInit {
  protected readonly datePickerContext = useDatePickerContext()
  protected readonly tableContext = useDatePickerTableContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.datePickerContext().getTableBodyBindings(this.tableContext()),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
