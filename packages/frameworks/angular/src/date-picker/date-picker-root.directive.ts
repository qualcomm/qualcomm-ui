// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
} from "@angular/core"

import {
  CoreDatePickerRootDirective,
  provideDatePickerContext,
  provideDatePickerViewContext,
} from "@qualcomm-ui/angular-core/date-picker"
import {INPUT_FORM_CONTROL_CONTEXT} from "@qualcomm-ui/angular-core/input"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsDatePickerApi,
  type QdsDatePickerApiProps,
} from "@qualcomm-ui/qds-core/date-picker"
import type {QdsInputSize} from "@qualcomm-ui/qds-core/input"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {
  provideQdsDatePickerContext,
  QdsDatePickerContextService,
} from "./qds-date-picker-context.service"

@Directive({
  providers: [
    {
      provide: INPUT_FORM_CONTROL_CONTEXT,
      useFactory: () =>
        inject(DatePickerRootDirective, {self: true}).formControlContext,
    },
    provideDatePickerContext(),
    provideDatePickerViewContext(),
    provideQdsDatePickerContext(),
    providePresenceContext(),
  ],
  selector: "[q-date-picker-root]",
  standalone: false,
})
export class DatePickerRootDirective
  extends CoreDatePickerRootDirective
  implements SignalifyInput<QdsDatePickerApiProps>
{
  /**
   * Whether to hide days from the previous and next months in the current month
   * view. By default those days are shown.
   *
   * @default false
   */
  readonly hideOutsideDays = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The size of the input field and its elements. Does not affect the calendar
   * pane.
   *
   * @default 'md'
   */
  readonly size = input<QdsInputSize>()

  protected readonly qdsDatePickerService = inject(QdsDatePickerContextService)

  override ngOnInit() {
    this.trackBindings.extendWith(
      computed(() => this.qdsDatePickerService.context().getRootBindings()),
    )

    this.qdsDatePickerService.init(
      computed(() =>
        createQdsDatePickerApi(
          {
            hideOutsideDays: this.hideOutsideDays(),
            size: this.size(),
          } satisfies Explicit<QdsDatePickerApiProps>,
          normalizeProps,
        ),
      ),
    )

    super.ngOnInit()
  }
}
