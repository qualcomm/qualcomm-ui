import {Directive} from "@angular/core"

import {CorePopoverLabelDirective} from "@qualcomm-ui/angular-core/popover"
import {popoverClasses} from "@qualcomm-ui/qds-core/popover"

@Directive({
  host: {
    "[class]": "popoverClasses.label",
  },
  selector: "[q-popover-label]",
  standalone: false,
})
export class PopoverLabelDirective extends CorePopoverLabelDirective {
  protected readonly popoverClasses = popoverClasses
}
