// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreCollapsibleTriggerDirective} from "@qualcomm-ui/angular-core/collapsible"

@Directive({
  selector: "[q-collapsible-trigger]",
  standalone: false,
})
export class CollapsibleTriggerComponent extends CoreCollapsibleTriggerDirective {}
