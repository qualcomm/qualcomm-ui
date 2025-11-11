// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useSelectContext} from "./select-context.service"

@Directive()
export class CoreSelectIndicatorDirective implements OnInit {
  protected readonly selectContext = useSelectContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.selectContext().getIndicatorBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
