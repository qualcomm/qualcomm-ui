import {Directive, inject} from "@angular/core"

import {DialogContextService} from "@qualcomm-ui/angular-core/dialog"
import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import type {DialogApi} from "@qualcomm-ui/core/dialog"
import type {PaginationApi} from "@qualcomm-ui/core/pagination"

@Directive({
  selector: "[drawerContext]",
  standalone: false,
})
export class DrawerContextDirective extends ApiContextDirective<DialogApi> {
  constructor() {
    const contextService = inject(DialogContextService)
    super(contextService, "dialogContext")
  }

  /**
   * Provides intellisense for the context in the template.
   */
  static ngTemplateContextGuard(
    dir: DrawerContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: PaginationApi} {
    return true
  }
}
