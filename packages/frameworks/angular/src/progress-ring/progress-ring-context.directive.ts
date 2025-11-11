// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject} from "@angular/core"

import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import {ProgressRingContextService} from "@qualcomm-ui/angular-core/progress-ring"
import type {ProgressApi} from "@qualcomm-ui/core/progress"

@Directive({
  selector: "[progressRingContext]",
  standalone: false,
})
export class ProgressRingContextDirective extends ApiContextDirective<ProgressApi> {
  constructor() {
    const contextService = inject(ProgressRingContextService)
    super(contextService, "progressRingContext")
  }

  /**
   * Type guard for the context, provides intellisense for the context in the
   * template.
   */
  static ngTemplateContextGuard(
    dir: ProgressRingContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: ProgressApi} {
    return true
  }
}
