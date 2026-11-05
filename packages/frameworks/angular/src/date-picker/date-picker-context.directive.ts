// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject} from "@angular/core"

import {DatePickerContextService} from "@qualcomm-ui/angular-core/date-picker"
import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import type {DatePickerApi} from "@qualcomm-ui/core/date-picker"

@Directive({
  selector: "[datePickerContext]",
  standalone: false,
})
export class DatePickerContextDirective extends ApiContextDirective<DatePickerApi> {
  constructor() {
    const contextService = inject(DatePickerContextService)
    super(contextService, "datePickerContext")
  }

  /**
   * Type guard for the context, provides intellisense for the context in the
   * template.
   */
  static ngTemplateContextGuard(
    _dir: DatePickerContextDirective,
    _ctx: unknown,
  ): _ctx is {$implicit: DatePickerApi} {
    return true
  }
}
