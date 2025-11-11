// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CorePopoverContentDirective} from "@qualcomm-ui/angular-core/popover"
import {popoverClasses} from "@qualcomm-ui/qds-core/popover"

@Directive({
  host: {
    "[class]": "popoverClasses.content",
  },
  selector: "[q-popover-content]",
  standalone: false,
})
export class PopoverContentDirective extends CorePopoverContentDirective {
  protected readonly popoverClasses = popoverClasses
}
