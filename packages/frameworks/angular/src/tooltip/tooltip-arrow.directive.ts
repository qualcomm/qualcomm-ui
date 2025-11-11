// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component} from "@angular/core"

import {CoreTooltipArrowDirective} from "@qualcomm-ui/angular-core/tooltip"
import {tooltipClasses} from "@qualcomm-ui/qds-core/tooltip"

@Component({
  host: {
    "[class]": "tooltipClasses.arrow",
  },
  selector: "[q-tooltip-arrow]",
  standalone: false,
  template: `
    <ng-content select="[q-tooltip-arrow-tip]">
      <div q-tooltip-arrow-tip></div>
    </ng-content>
  `,
})
export class TooltipArrowDirective extends CoreTooltipArrowDirective {
  protected readonly tooltipClasses = tooltipClasses
}
