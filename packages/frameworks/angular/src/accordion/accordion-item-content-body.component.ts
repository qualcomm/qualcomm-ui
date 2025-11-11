// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"

@Directive({
  host: {
    "[class]": "accordionClasses.itemContentBody",
  },
  selector: "[q-accordion-item-content-body]",
  standalone: false,
})
export class AccordionItemContentBodyComponent {
  protected readonly accordionClasses = accordionClasses
}
