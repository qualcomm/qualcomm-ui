// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"

@Directive({
  host: {
    "[class]": "accordionClasses.icon",
  },
  selector: "[q-accordion-item-icon]",
  standalone: false,
})
export class AccordionItemIconComponent {
  protected readonly accordionClasses = accordionClasses
}
