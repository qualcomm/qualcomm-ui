// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import {DialogBackdropDirective} from "@qualcomm-ui/angular/dialog"

/**
 * The backdrop that overlays the content behind the drawer.
 */
@Directive({
  providers: [providePresenceContext()],
  selector: "[q-drawer-backdrop]",
  standalone: false,
})
export class DrawerBackdropDirective extends DialogBackdropDirective {}
