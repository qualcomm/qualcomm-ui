// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useTextInputContext} from "./text-input-context.service"

@Directive()
export class CoreTextInputInputGroupDirective implements OnInit {
  protected readonly textInputContext = useTextInputContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.textInputContext().getInputGroupBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
