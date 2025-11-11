import {computed, Directive} from "@angular/core"

import {CoreDialogContentDirective} from "@qualcomm-ui/angular-core/dialog"

import {useQdsDialogContext} from "./qds-dialog-context.service"

/**
 * A container for the dialog contents.
 */
@Directive({
  selector: "[q-dialog-content]",
  standalone: false,
})
export class DialogContentDirective extends CoreDialogContentDirective {
  protected readonly qdsContext = useQdsDialogContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getContentBindings()),
    )
  }
}
