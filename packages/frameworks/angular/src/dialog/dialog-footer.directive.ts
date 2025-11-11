import {computed, Directive} from "@angular/core"

import {CoreDialogFooterDirective} from "@qualcomm-ui/angular-core/dialog"

import {useQdsDialogContext} from "./qds-dialog-context.service"

/**
 * The footer section of the dialog. Typically contains action buttons.
 */
@Directive({
  selector: "[q-dialog-footer]",
  standalone: false,
})
export class DialogFooterDirective extends CoreDialogFooterDirective {
  protected readonly qdsContext = useQdsDialogContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getFooterBindings()),
    )
  }
}
