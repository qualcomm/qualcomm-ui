// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {usePopoverContext} from "./popover-context.service"

@Directive()
export class CorePopoverArrowTipDirective implements OnInit {
  private readonly popoverContext = usePopoverContext()

  private readonly trackBindings = useTrackBindings(() =>
    this.popoverContext().getArrowTipBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
