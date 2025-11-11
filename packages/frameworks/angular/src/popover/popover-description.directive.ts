// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CorePopoverDescriptionDirective} from "@qualcomm-ui/angular-core/popover"
import {popoverClasses} from "@qualcomm-ui/qds-core/popover"

@Directive({
  host: {
    "[class]": "popoverClasses.description",
  },
  selector: "[q-popover-description]",
  standalone: false,
})
export class PopoverDescriptionDirective extends CorePopoverDescriptionDirective {
  protected readonly popoverClasses = popoverClasses
}
