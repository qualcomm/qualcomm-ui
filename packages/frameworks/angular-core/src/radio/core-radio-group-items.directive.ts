// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useRadioContext} from "./radio-context.service"

@Directive()
export class CoreRadioGroupItemsDirective implements OnInit {
  protected readonly radioContext = useRadioContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.radioContext().getGroupItemsBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
