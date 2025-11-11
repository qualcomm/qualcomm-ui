// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CorePopoverTriggerDirective} from "@qualcomm-ui/angular-core/popover"
import {popoverClasses} from "@qualcomm-ui/qds-core/popover"

@Directive({
  host: {
    "[class]": "popoverClasses.trigger",
  },
  selector: "[q-popover-trigger]",
  standalone: false,
})
export class PopoverTriggerDirective extends CorePopoverTriggerDirective {
  protected readonly popoverClasses = popoverClasses
}
