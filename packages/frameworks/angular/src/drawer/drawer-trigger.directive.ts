import {Directive} from "@angular/core"

import {CoreDialogTriggerDirective} from "@qualcomm-ui/angular-core/dialog"

@Directive({
  selector: "[q-drawer-trigger]",
  standalone: false,
})
export class DrawerTriggerDirective extends CoreDialogTriggerDirective {}
