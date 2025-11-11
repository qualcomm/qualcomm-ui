import {Directive} from "@angular/core"

import {CoreTooltipTriggerDirective} from "@qualcomm-ui/angular-core/tooltip"

@Directive({
  selector: "[q-tooltip-trigger]",
  standalone: false,
})
export class TooltipTriggerDirective extends CoreTooltipTriggerDirective {}
