// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreTooltipTriggerDirective} from "@qualcomm-ui/angular-core/tooltip"

@Directive({
  selector: "[q-tooltip-trigger]",
  standalone: false,
})
export class TooltipTriggerDirective extends CoreTooltipTriggerDirective {}
