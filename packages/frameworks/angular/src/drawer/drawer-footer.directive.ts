// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {DialogFooterDirective} from "@qualcomm-ui/angular/dialog"

/**
 * The footer section of the drawer. Typically contains action buttons.
 */
@Directive({
  selector: "[q-drawer-footer]",
  standalone: false,
})
export class DrawerFooterDirective extends DialogFooterDirective {}
