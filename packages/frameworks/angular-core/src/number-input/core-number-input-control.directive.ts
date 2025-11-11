// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useNumberInputContext} from "./number-input-context.service"

@Directive()
export class CoreNumberInputControlDirective implements OnInit {
  protected readonly numberInputContext = useNumberInputContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.numberInputContext().getControlBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
