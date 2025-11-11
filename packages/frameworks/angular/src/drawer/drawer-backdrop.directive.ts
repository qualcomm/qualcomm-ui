import {Directive} from "@angular/core"

import {DialogBackdropDirective} from "@qualcomm-ui/angular/dialog"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"

/**
 * The backdrop that overlays the content behind the drawer.
 */
@Directive({
  providers: [providePresenceContext()],
  selector: "[q-drawer-backdrop]",
  standalone: false,
})
export class DrawerBackdropDirective extends DialogBackdropDirective {}
