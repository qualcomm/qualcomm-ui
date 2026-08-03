// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Container for the calendar headline.
 */
@Directive({
  selector: "[q-date-picker-headline]",
  standalone: false,
})
export class DatePickerHeadlineDirective implements OnInit {
  protected readonly qdsContext = useQdsDatePickerContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getHeadlineBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
