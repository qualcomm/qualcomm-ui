// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject} from "@angular/core"

import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import {PaginationContextService} from "@qualcomm-ui/angular-core/pagination"
import type {PaginationApi} from "@qualcomm-ui/core/pagination"

@Directive({
  selector: "[paginationContext]",
  standalone: false,
})
export class PaginationContextDirective extends ApiContextDirective<PaginationApi> {
  constructor() {
    const contextService = inject(PaginationContextService)
    super(contextService, "paginationContext")
  }

  /**
   * Provides intellisense for the context in the template.
   */
  static ngTemplateContextGuard(
    dir: PaginationContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: PaginationApi} {
    return true
  }
}
