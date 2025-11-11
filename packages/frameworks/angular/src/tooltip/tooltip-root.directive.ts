// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {
  CoreTooltipRootDirective,
  provideTooltipContext,
} from "@qualcomm-ui/angular-core/tooltip"

@Directive({
  providers: [provideTooltipContext()],
  selector: "[q-tooltip-root]",
  standalone: false,
})
export class TooltipRootDirective extends CoreTooltipRootDirective {}
