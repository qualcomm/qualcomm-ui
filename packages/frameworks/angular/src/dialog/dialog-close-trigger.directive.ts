import {Directive} from "@angular/core"

import {CoreDialogCloseTriggerDirective} from "@qualcomm-ui/angular-core/dialog"

/**
 * A trigger element that closes the dialog when activated.
 */
@Directive({
  selector: "[q-dialog-close-trigger]",
  standalone: false,
})
export class DialogCloseTriggerDirective extends CoreDialogCloseTriggerDirective {}
