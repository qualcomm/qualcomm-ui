// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {DialogHeadingDirective} from "@qualcomm-ui/angular/dialog"

/**
 * A heading that labels the drawer.
 */
@Directive({
  selector: "[q-drawer-heading]",
  standalone: false,
})
export class DrawerHeadingDirective extends DialogHeadingDirective {}
