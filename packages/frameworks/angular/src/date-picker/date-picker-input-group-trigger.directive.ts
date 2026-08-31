// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useDatePickerContext} from "@qualcomm-ui/angular-core/date-picker"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Applies every binding on the bordered field, and in `multiple` mode turns it
 * into the calendar trigger since no text input owns focus there.
 *
 * Do not add a second binding system to this element: `role`, `dir`, and
 * `aria-invalid` change source with the mode, so two writers clobber each other
 * on a runtime mode switch. Must stay in `useTrackBindings` — id registration
 * writes a signal, which a `computed` forbids (NG0600).
 */
@Directive({
  selector: "div[q-date-picker-input-group-trigger]",
  standalone: false,
})
export class DatePickerInputGroupTriggerDirective implements OnInit {
  /**
   * Id of the label describing the field as a group. Omitted when the label
   * describes a single input directly.
   */
  readonly groupLabelId = input<string | undefined>()

  protected readonly api = useDatePickerContext()
  protected readonly qdsContext = useQdsDatePickerContext()
  protected readonly hostId = computed(() => useId(this, undefined))
  protected readonly onDestroy = useOnDestroy()

  protected readonly trackBindings = useTrackBindings(() => {
    const api = this.api()
    const groupLabelId = this.groupLabelId()
    const isMultiple = api.selectionMode === "multiple"

    return mergeProps(
      api.getInputGroupBindings(),
      isMultiple
        ? api.getInputGroupTriggerBindings({
            id: this.hostId(),
            onDestroy: this.onDestroy,
          })
        : {},
      this.qdsContext().getInputGroupBindings(),
      {
        "aria-labelledby": groupLabelId,
        ...(groupLabelId && !isMultiple ? {role: "group"} : {}),
      },
    )
  })

  ngOnInit() {
    this.trackBindings()
  }
}
