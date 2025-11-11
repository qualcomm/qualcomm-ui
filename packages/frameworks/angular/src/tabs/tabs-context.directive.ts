// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject} from "@angular/core"

import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import {TabsContextService} from "@qualcomm-ui/angular-core/tabs"
import type {TabsApi} from "@qualcomm-ui/core/tabs"

/**
 * Access the API of the {@link TabsRootDirective} in the template.
 *
 * @example
 * ```angular-html
 * <div q-tabs-root>
 *   <ng-container *tabsContext="let tabsApi">
 *     <button (click)="tabsApi.setValue('abc')"></button>
 *   </ng-container>
 * </div>
 * ```
 */
@Directive({
  selector: "[tabsContext]",
  standalone: false,
})
export class TabsContextDirective extends ApiContextDirective<TabsApi> {
  constructor() {
    const contextService = inject(TabsContextService)
    super(contextService, "tabsContext")
  }

  /**
   * Provides intellisense for the context in the template.
   */
  static ngTemplateContextGuard(
    dir: TabsContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: TabsApi} {
    return true
  }
}
