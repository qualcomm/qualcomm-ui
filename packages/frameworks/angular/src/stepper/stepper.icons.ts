// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewEncapsulation,
} from "@angular/core"
import {
  LucideIconBase,
  type LucideIconData,
  lucideIconTemplate,
} from "@lucide/angular"

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: "svg[lucideAccessibility]",
  standalone: true,
  template: lucideIconTemplate,
})
export class StepperIndicatorAlertIcon extends LucideIconBase {
  static readonly icon: LucideIconData = {
    name: "stepper-indicator-alert",
    node: [
      [
        "line",
        {
          key: "1pkeuh",
          "stroke-width": "3",
          x1: "12",
          x2: "12",
          y1: "6",
          y2: "13",
        },
      ],
      [
        "line",
        {
          key: "4dfq90",
          "stroke-width": "3",
          x1: "12",
          x2: "12.01",
          y1: "18",
          y2: "18",
        },
      ],
    ],
    size: 24,
  }
  protected override readonly icon = signal(StepperIndicatorAlertIcon.icon)
}
