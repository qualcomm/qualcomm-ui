// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  numberAttribute,
  type OnInit,
} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {
  DateValue,
  DatePickerApiDayTableCellProps,
  DatePickerApiTableCellProps,
  DatePickerVisibleRange,
} from "@qualcomm-ui/core/date-picker"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {
  DatePickerTableCellContextService,
  useDatePickerContext,
  useDatePickerTableContext,
} from "./date-picker-context.service"

@Directive()
export class CoreDatePickerTableCellDirective implements OnInit {
  /**
   * The number of columns in the grid. Only applies to the month and year views.
   */
  readonly columns = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  })

  /**
   * Whether this cell is not selectable.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The cell value. A `DateValue` in the day view, the month or year number
   * otherwise.
   */
  readonly value = input.required<DateValue | number>()

  /**
   * The visible range of the enclosing grid. Only applies to the day view.
   */
  readonly visibleRange = input<DatePickerVisibleRange | undefined>()

  protected readonly datePickerContext = useDatePickerContext()
  protected readonly tableContext = useDatePickerTableContext()
  protected readonly cellContextService = inject(
    DatePickerTableCellContextService,
  )

  protected readonly trackBindings = useTrackBindings(() => {
    const api = this.datePickerContext()
    const cellProps = this.cellContextService.context()

    switch (this.tableContext().view) {
      case "month":
        return api.getMonthTableCellBindings(
          cellProps as DatePickerApiTableCellProps,
        )
      case "year":
        return api.getYearTableCellBindings(
          cellProps as DatePickerApiTableCellProps,
        )
      default:
        return api.getDayTableCellBindings(
          cellProps as DatePickerApiDayTableCellProps,
        )
    }
  })

  ngOnInit() {
    this.cellContextService.init(
      computed(
        () =>
          ({
            columns: this.columns(),
            disabled: this.disabled(),
            value: this.value(),
            visibleRange: this.visibleRange(),
          }) as DatePickerApiDayTableCellProps | DatePickerApiTableCellProps,
      ),
    )
    this.trackBindings()
  }
}
