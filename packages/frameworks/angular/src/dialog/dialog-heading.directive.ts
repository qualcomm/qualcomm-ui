import {computed, Directive} from "@angular/core"

import {CoreDialogHeadingDirective} from "@qualcomm-ui/angular-core/dialog"

import {useQdsDialogContext} from "./qds-dialog-context.service"

/**
 * A heading that labels the dialog.
 */
@Directive({
  selector: "[q-dialog-heading]",
  standalone: false,
})
export class DialogHeadingDirective extends CoreDialogHeadingDirective {
  protected readonly qdsContext = useQdsDialogContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getHeadingBindings()),
    )
  }
}
