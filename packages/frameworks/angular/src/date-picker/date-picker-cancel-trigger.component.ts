// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, type OnInit} from "@angular/core"

import {useDatePickerContext} from "@qualcomm-ui/angular-core/date-picker"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {useButtonApi} from "@qualcomm-ui/angular/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * Discards selection, restores previous value, and closes the calendar. Styled
 * as a ghost button with the label "Cancel" by default.
 */
@Component({
  selector: "[q-date-picker-cancel-trigger]",
  standalone: false,
  template: `
    <ng-content>Cancel</ng-content>
  `,
})
export class DatePickerCancelTriggerDirective implements OnInit {
  protected readonly datePickerContext = useDatePickerContext()

  protected readonly buttonApi = useButtonApi({
    density: "compact",
    emphasis: "primary",
    variant: "ghost",
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      {onclick: () => this.datePickerContext().cancel(), type: "button"},
      this.buttonApi().getRootBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
