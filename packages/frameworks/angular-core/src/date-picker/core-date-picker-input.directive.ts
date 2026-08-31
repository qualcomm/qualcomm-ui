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

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {INPUT_FORM_CONTROL_CONTEXT} from "@qualcomm-ui/angular-core/input"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {DatePickerApiInputProps} from "@qualcomm-ui/core/date-picker"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useDatePickerContext} from "./date-picker-context.service"

@Directive()
export class CoreDatePickerInputDirective
  implements SignalifyInput<DatePickerApiInputProps>, OnInit
{
  /**
   * Whether to fix the input value on blur.
   *
   * @default true
   */
  readonly fixOnBlur = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  /**
   * The index of the input. Range pickers render one input per boundary, `0` for
   * the start date and `1` for the end date.
   */
  readonly index = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  })

  protected readonly datePickerContext = useDatePickerContext()
  protected readonly hostId = computed(() => useId(this, this.id()))
  protected readonly onDestroy = useOnDestroy()

  protected readonly formControlContext = inject(INPUT_FORM_CONTROL_CONTEXT, {
    optional: true,
  })

  /**
   * Deferred: must land after the machine's blur transition, which `send` queues.
   */
  protected readonly reportTouched = () => {
    queueMicrotask(() => this.formControlContext?.onTouched?.())
  }

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.datePickerContext().getInputBindings({
        fixOnBlur: this.fixOnBlur(),
        id: this.hostId(),
        index: this.index(),
        onDestroy: this.onDestroy,
      }),
      {onfocusout: this.reportTouched},
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
