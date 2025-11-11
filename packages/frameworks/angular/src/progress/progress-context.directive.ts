// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject} from "@angular/core"

import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import {ProgressContextService} from "@qualcomm-ui/angular-core/progress"
import type {ProgressApi} from "@qualcomm-ui/core/progress"

@Directive({
  selector: "[progressContext]",
  standalone: false,
})
export class ProgressContextDirective extends ApiContextDirective<ProgressApi> {
  constructor() {
    const contextService = inject(ProgressContextService)
    super(contextService, "progressContext")
  }

  /**
   * Type guard for the context, provides intellisense for the context in the
   * template.
   */
  static ngTemplateContextGuard(
    dir: ProgressContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: ProgressApi} {
    return true
  }
}
