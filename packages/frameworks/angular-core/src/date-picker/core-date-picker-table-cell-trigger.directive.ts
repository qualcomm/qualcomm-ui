// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {
  DatePickerApiDayTableCellProps,
  DatePickerApiTableCellProps,
} from "@qualcomm-ui/core/date-picker"

import {
  useDatePickerContext,
  useDatePickerTableCellContext,
  useDatePickerTableContext,
} from "./date-picker-context.service"

@Directive()
export class CoreDatePickerTableCellTriggerDirective implements OnInit {
  protected readonly datePickerContext = useDatePickerContext()
  protected readonly tableContext = useDatePickerTableContext()
  protected readonly cellContext = useDatePickerTableCellContext()

  protected readonly trackBindings = useTrackBindings(() => {
    const api = this.datePickerContext()
    const cellProps = this.cellContext()

    switch (this.tableContext().view) {
      case "month":
        return api.getMonthTableCellTriggerBindings(
          cellProps as DatePickerApiTableCellProps,
        )
      case "year":
        return api.getYearTableCellTriggerBindings(
          cellProps as DatePickerApiTableCellProps,
        )
      default:
        return api.getDayTableCellTriggerBindings(
          cellProps as DatePickerApiDayTableCellProps,
        )
    }
  })

  ngOnInit() {
    this.trackBindings()
  }
}
