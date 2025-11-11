// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreDialogTriggerDirective} from "@qualcomm-ui/angular-core/dialog"

@Directive({
  selector: "[q-drawer-trigger]",
  standalone: false,
})
export class DrawerTriggerDirective extends CoreDialogTriggerDirective {}
