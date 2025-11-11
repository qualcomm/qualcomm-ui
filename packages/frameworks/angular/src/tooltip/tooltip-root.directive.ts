import {Directive} from "@angular/core"

import {
  CoreTooltipRootDirective,
  provideTooltipContext,
} from "@qualcomm-ui/angular-core/tooltip"

@Directive({
  providers: [provideTooltipContext()],
  selector: "[q-tooltip-root]",
  standalone: false,
})
export class TooltipRootDirective extends CoreTooltipRootDirective {}
