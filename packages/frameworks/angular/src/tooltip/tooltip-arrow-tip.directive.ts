// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreTooltipArrowTipDirective} from "@qualcomm-ui/angular-core/tooltip"
import {tooltipClasses} from "@qualcomm-ui/qds-core/tooltip"

@Directive({
  host: {
    "[class]": "tooltipClasses.arrowTip",
  },
  selector: "[q-tooltip-arrow-tip]",
  standalone: false,
})
export class TooltipArrowTipDirective extends CoreTooltipArrowTipDirective {
  protected readonly tooltipClasses = tooltipClasses
}
