// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, type OnInit} from "@angular/core"

import {useDatePickerContext} from "@qualcomm-ui/angular-core/date-picker"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Caption above the headline value. Project content to override the default.
 */
@Component({
  selector: "[q-date-picker-headline-label]",
  standalone: false,
  template: `
    <ng-content>{{ fallback() }}</ng-content>
  `,
})
export class DatePickerHeadlineLabelDirective implements OnInit {
  protected readonly api = useDatePickerContext()
  protected readonly qdsContext = useQdsDatePickerContext()

  protected readonly fallback = computed(() =>
    this.api().selectionMode === "range" ? "Date range" : "Date",
  )

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getHeadlineLabelBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
