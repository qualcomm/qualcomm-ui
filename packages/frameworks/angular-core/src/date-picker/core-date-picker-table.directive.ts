// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  inject,
  input,
  numberAttribute,
  type OnInit,
} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {
  DatePickerDateView,
  DatePickerApiTableProps,
} from "@qualcomm-ui/core/date-picker"

import {
  DatePickerTableContextService,
  useDatePickerContext,
  useDatePickerViewContext,
} from "./date-picker-context.service"

@Directive()
export class CoreDatePickerTableDirective
  implements SignalifyInput<DatePickerApiTableProps>, OnInit
{
  /**
   * The number of columns in the grid.
   */
  readonly columns = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  })

  /**
   * The calendar view this grid renders. Defaults to the enclosing `View`.
   */
  readonly view = input<DatePickerDateView | undefined>()

  protected readonly datePickerContext = useDatePickerContext()
  protected readonly viewContext = useDatePickerViewContext()
  protected readonly tableContextService = inject(DatePickerTableContextService)

  protected readonly resolvedView = computed(
    () => this.view() ?? this.viewContext().view,
  )

  protected readonly resolvedColumns = computed(() => this.columns())

  protected readonly trackBindings = useTrackBindings(() =>
    this.datePickerContext().getTableBindings(
      this.tableContextService.context(),
    ),
  )

  ngOnInit() {
    this.tableContextService.init(
      computed(() => ({
        columns: this.resolvedColumns(),
        view: this.resolvedView(),
      })),
    )
    this.trackBindings()
  }
}
