// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreMenuContextTriggerDirective} from "@qualcomm-ui/angular-core/menu"

@Directive({
  selector: "[q-menu-context-trigger]",
  standalone: false,
})
export class MenuContextTriggerDirective extends CoreMenuContextTriggerDirective {}
