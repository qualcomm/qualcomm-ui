// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreAccordionItemTriggerSecondaryDirective} from "@qualcomm-ui/angular-core/accordion"
import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"

@Directive({
  host: {
    "[class]": "accordionClasses.itemTriggerSecondary",
  },
  selector: "[q-accordion-item-secondary-text]",
  standalone: false,
})
export class AccordionItemSecondaryTextComponent extends CoreAccordionItemTriggerSecondaryDirective {
  protected readonly accordionClasses = accordionClasses
}
