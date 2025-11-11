// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useSwitchContext} from "./switch-context.service"

@Directive()
export class CoreSwitchControlDirective implements OnInit {
  protected readonly switchContext = useSwitchContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.switchContext().getControlBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
