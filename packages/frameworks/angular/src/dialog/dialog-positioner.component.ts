import {computed, Directive} from "@angular/core"

import {CoreDialogPositionerDirective} from "@qualcomm-ui/angular-core/dialog"

import {useQdsDialogContext} from "./qds-dialog-context.service"

/**
 * A container for the dialog content that handles positioning.
 */
@Directive({
  selector: "[q-dialog-positioner]",
  standalone: false,
})
export class DialogPositionerComponent extends CoreDialogPositionerDirective {
  protected readonly qdsContext = useQdsDialogContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getPositionerBindings()),
    )
  }
}
