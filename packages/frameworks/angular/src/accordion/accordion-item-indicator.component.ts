// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"
import {ChevronDown} from "lucide-angular"

import {CoreAccordionItemTriggerIndicatorDirective} from "@qualcomm-ui/angular-core/accordion"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"

@Component({
  host: {
    "[class]": "accordionClasses.itemTriggerIndicator",
  },
  selector: "q-accordion-item-indicator",
  standalone: false,
  template: `
    <svg [qIcon]="icon()"></svg>
  `,
})
export class AccordionItemIndicatorComponent extends CoreAccordionItemTriggerIndicatorDirective {
  protected readonly accordionClasses = accordionClasses
  /**
   * Indicator icon for the accordion item trigger.
   * @default ChevronDown
   */
  readonly icon = input<LucideIconOrString>(ChevronDown)
}
