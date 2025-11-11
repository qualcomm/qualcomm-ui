import {Directive, inject} from "@angular/core"

import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import {SelectContextService} from "@qualcomm-ui/angular-core/select"
import type {SelectApi} from "@qualcomm-ui/core/select"

@Directive({
  selector: "[selectContext]",
  standalone: false,
})
export class SelectContextDirective extends ApiContextDirective<SelectApi> {
  constructor() {
    const contextService = inject(SelectContextService)
    super(contextService, "selectContext")
  }

  /**
   * Type guard for the context, provides intellisense for the context in the
   * template.
   */
  static ngTemplateContextGuard(
    dir: SelectContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: SelectApi} {
    return true
  }
}
