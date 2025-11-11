import {Directive} from "@angular/core"

import {CoreTooltipContentDirective} from "@qualcomm-ui/angular-core/tooltip"
import {tooltipClasses} from "@qualcomm-ui/qds-core/tooltip"

@Directive({
  host: {
    "[class]": "tooltipClasses.content",
  },
  selector: "[q-tooltip-content]",
  standalone: false,
})
export class TooltipContentDirective extends CoreTooltipContentDirective {
  protected readonly tooltipClasses = tooltipClasses
}
