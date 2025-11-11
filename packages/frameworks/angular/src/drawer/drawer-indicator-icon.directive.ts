import {Directive} from "@angular/core"

import {DialogIndicatorIconDirective} from "@qualcomm-ui/angular/dialog"

/**
 * An icon that indicates the drawer's status.
 */
@Directive({
  selector: "[q-drawer-indicator-icon]",
  standalone: false,
})
export class DrawerIndicatorIconDirective extends DialogIndicatorIconDirective {}
