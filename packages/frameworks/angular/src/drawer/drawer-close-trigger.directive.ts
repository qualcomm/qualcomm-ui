// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreDialogCloseTriggerDirective} from "@qualcomm-ui/angular-core/dialog"

/**
 * A trigger element that closes the drawer when activated.
 */
@Directive({
  selector: "[q-drawer-close-trigger]",
  standalone: false,
})
export class DrawerCloseTriggerDirective extends CoreDialogCloseTriggerDirective {}
