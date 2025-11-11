import {Directive} from "@angular/core"

import {CoreTooltipPositionerDirective} from "@qualcomm-ui/angular-core/tooltip"
import {tooltipClasses} from "@qualcomm-ui/qds-core/tooltip"

@Directive({
  host: {
    "[class]": "tooltipClasses.positioner",
  },
  selector: "[q-tooltip-positioner]",
  standalone: false,
})
export class TooltipPositionerDirective extends CoreTooltipPositionerDirective {
  protected readonly tooltipClasses = tooltipClasses
}
