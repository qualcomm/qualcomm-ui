// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useCheckboxContext} from "./checkbox-context.service"

@Directive()
export class CoreCheckboxIndicatorDirective implements OnInit {
  protected readonly checkboxContext = useCheckboxContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.checkboxContext().getIndicatorBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
