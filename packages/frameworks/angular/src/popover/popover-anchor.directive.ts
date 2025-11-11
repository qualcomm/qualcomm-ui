// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CorePopoverAnchorDirective} from "@qualcomm-ui/angular-core/popover"

@Directive({
  selector: "[q-popover-anchor]",
  standalone: false,
})
export class PopoverAnchorDirective extends CorePopoverAnchorDirective {}
