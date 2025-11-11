// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CorePopoverPositionerDirective} from "@qualcomm-ui/angular-core/popover"

@Directive({
  selector: "[q-popover-positioner]",
  standalone: false,
})
export class PopoverPositionerDirective extends CorePopoverPositionerDirective {}
