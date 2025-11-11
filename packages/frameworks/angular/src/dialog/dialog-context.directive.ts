// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject} from "@angular/core"

import {DialogContextService} from "@qualcomm-ui/angular-core/dialog"
import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import type {DialogApi} from "@qualcomm-ui/core/dialog"

@Directive({
  selector: "[dialogContext]",
  standalone: false,
})
export class DialogContextDirective extends ApiContextDirective<DialogApi> {
  constructor() {
    const contextService = inject(DialogContextService)
    super(contextService, "dialogContext")
  }

  /**
   * Provides intellisense for the context in the template.
   */
  static ngTemplateContextGuard(
    dir: DialogContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: DialogApi} {
    return true
  }
}
