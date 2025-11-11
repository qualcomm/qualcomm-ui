import {Directive} from "@angular/core"

import {CoreDialogCloseTriggerDirective} from "@qualcomm-ui/angular-core/dialog"

/**
 * A trigger element that closes the drawer when activated.
 */
@Directive({
  selector: "[q-drawer-close-trigger]",
  standalone: false,
})
export class DrawerCloseTriggerDirective extends CoreDialogCloseTriggerDirective {}
