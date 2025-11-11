import {Directive} from "@angular/core"

import {CorePopoverPositionerDirective} from "@qualcomm-ui/angular-core/popover"

@Directive({
  selector: "[q-popover-positioner]",
  standalone: false,
})
export class PopoverPositionerDirective extends CorePopoverPositionerDirective {}
