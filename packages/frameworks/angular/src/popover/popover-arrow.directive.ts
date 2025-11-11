import {Component} from "@angular/core"

import {CorePopoverArrowDirective} from "@qualcomm-ui/angular-core/popover"
import {popoverClasses} from "@qualcomm-ui/qds-core/popover"

@Component({
  host: {
    "[class]": "popoverClasses.arrow",
  },
  selector: "[q-popover-arrow]",
  standalone: false,
  template: `
    <ng-content>
      <div q-popover-arrow-tip></div>
    </ng-content>
  `,
})
export class PopoverArrowDirective extends CorePopoverArrowDirective {
  protected readonly popoverClasses = popoverClasses
}
