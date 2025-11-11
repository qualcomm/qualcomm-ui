import {Directive} from "@angular/core"

import {CoreDialogDescriptionDirective} from "@qualcomm-ui/angular-core/dialog"

/**
 * A description that provides additional context about the drawer.
 */
@Directive({
  selector: "[q-drawer-description]",
  standalone: false,
})
export class DrawerDescriptionDirective extends CoreDialogDescriptionDirective {}
