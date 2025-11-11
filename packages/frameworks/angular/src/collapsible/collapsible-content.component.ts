import {Directive} from "@angular/core"

import {CoreCollapsibleContentDirective} from "@qualcomm-ui/angular-core/collapsible"
import {collapsibleClasses} from "@qualcomm-ui/qds-core/collapsible"

@Directive({
  host: {
    "[class]": "collapsibleClasses.content",
  },
  selector: "[q-collapsible-content]",
  standalone: false,
})
export class CollapsibleContentComponent extends CoreCollapsibleContentDirective {
  protected readonly collapsibleClasses = collapsibleClasses
}
