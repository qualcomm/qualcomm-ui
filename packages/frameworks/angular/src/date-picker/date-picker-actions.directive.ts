// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Footer container for the confirm and cancel actions. Intended for use when
 * `closeOnSelect` is `false`.
 */
@Directive({
  selector: "[q-date-picker-actions]",
  standalone: false,
})
export class DatePickerActionsDirective implements OnInit {
  protected readonly qdsContext = useQdsDatePickerContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getActionsBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
