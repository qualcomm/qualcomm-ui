// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CorePopoverLabelDirective} from "@qualcomm-ui/angular-core/popover"
import {popoverClasses} from "@qualcomm-ui/qds-core/popover"

@Directive({
  host: {
    "[class]": "popoverClasses.label",
  },
  selector: "[q-popover-label]",
  standalone: false,
})
export class PopoverLabelDirective extends CorePopoverLabelDirective {
  protected readonly popoverClasses = popoverClasses
}
