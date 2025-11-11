// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject} from "@angular/core"

import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import {TooltipContextService} from "@qualcomm-ui/angular-core/tooltip"
import type {TooltipApi} from "@qualcomm-ui/core/tooltip"

@Directive({
  selector: "[tooltipContext]",
  standalone: false,
})
export class TooltipContextDirective extends ApiContextDirective<TooltipApi> {
  constructor() {
    const contextService = inject(TooltipContextService)
    super(contextService, "tooltipContext")
  }

  /**
   * Provides intellisense for the context in the template.
   */
  static ngTemplateContextGuard(
    dir: TooltipContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: TooltipApi} {
    return true
  }
}
