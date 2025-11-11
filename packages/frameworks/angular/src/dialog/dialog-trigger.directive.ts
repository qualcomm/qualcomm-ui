// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreDialogTriggerDirective} from "@qualcomm-ui/angular-core/dialog"

/**
 * A trigger element that opens the dialog when activated.
 */
@Directive({
  selector: "[q-dialog-trigger]",
  standalone: false,
})
export class DialogTriggerDirective extends CoreDialogTriggerDirective {}
