import {Directive} from "@angular/core"

import {CoreDialogDescriptionDirective} from "@qualcomm-ui/angular-core/dialog"

/**
 * A description that provides additional context about the dialog.
 */
@Directive({
  selector: "[q-dialog-description]",
  standalone: false,
})
export class DialogDescriptionDirective extends CoreDialogDescriptionDirective {}
