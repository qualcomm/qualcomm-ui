import {Directive} from "@angular/core"

import {CorePopoverArrowTipDirective} from "@qualcomm-ui/angular-core/popover"
import {popoverClasses} from "@qualcomm-ui/qds-core/popover"

@Directive({
  host: {
    "[class]": "popoverClasses.arrowTip",
  },
  selector: "[q-popover-arrow-tip]",
  standalone: false,
})
export class PopoverArrowTipDirective extends CorePopoverArrowTipDirective {
  protected readonly popoverClasses = popoverClasses
}
