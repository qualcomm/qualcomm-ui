import {Directive, inject} from "@angular/core"

import {ComboboxContextService} from "@qualcomm-ui/angular-core/combobox"
import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import type {ComboboxApi} from "@qualcomm-ui/core/combobox"
import type {SelectApi} from "@qualcomm-ui/core/select"

@Directive({
  selector: "[comboboxContext]",
  standalone: false,
})
export class ComboboxContextDirective extends ApiContextDirective<ComboboxApi> {
  constructor() {
    const contextService = inject(ComboboxContextService)
    super(contextService, "comboboxContext")
  }

  /**
   * Type guard for the context, provides intellisense for the context in the
   * template.
   */
  static ngTemplateContextGuard(
    dir: ComboboxContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: SelectApi} {
    return true
  }
}
