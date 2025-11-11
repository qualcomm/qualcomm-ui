// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CorePopoverCloseTriggerDirective} from "@qualcomm-ui/angular-core/popover"
import {popoverClasses} from "@qualcomm-ui/qds-core/popover"

@Directive({
  host: {
    "[class]": "popoverClasses.closeTrigger",
  },
  selector: "[q-popover-close-trigger]",
  standalone: false,
})
export class PopoverCloseTriggerDirective extends CorePopoverCloseTriggerDirective {
  protected readonly popoverClasses = popoverClasses
}
