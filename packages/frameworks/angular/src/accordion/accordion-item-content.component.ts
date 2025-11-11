// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component} from "@angular/core"

import {AccordionItemContentAnimatorComponent} from "./accordion-item-content-animator.component"

@Component({
  selector: "[q-accordion-item-content]",
  standalone: false,
  template: `
    <div q-accordion-item-content-body>
      <ng-content />
    </div>
  `,
})
export class AccordionItemContentComponent extends AccordionItemContentAnimatorComponent {}
