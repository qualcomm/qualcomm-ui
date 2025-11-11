// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject} from "@angular/core"

import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import {PopoverContextService} from "@qualcomm-ui/angular-core/popover"
import type {PopoverApi} from "@qualcomm-ui/core/popover"

@Directive({
  selector: "[popoverContext]",
  standalone: false,
})
export class PopoverContextDirective extends ApiContextDirective<PopoverApi> {
  constructor() {
    const contextService = inject(PopoverContextService)
    super(contextService, "popoverContext")
  }

  /**
   * Provides intellisense for the context in the template.
   */
  static ngTemplateContextGuard(
    dir: PopoverContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: PopoverApi} {
    return true
  }
}
