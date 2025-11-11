// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useTooltipContext} from "./tooltip-context.service"

@Directive()
export class CoreTooltipArrowTipDirective implements OnInit {
  private readonly tooltipContext = useTooltipContext()

  private readonly trackBindings = useTrackBindings(() =>
    this.tooltipContext().getTooltipArrowTipBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
