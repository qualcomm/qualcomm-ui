// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useRadioContext} from "./radio-context.service"
import {useRadioItemContext} from "./radio-item-context.service"

@Directive()
export class CoreRadioItemControlDirective implements OnInit {
  protected readonly radioContext = useRadioContext()
  protected readonly radioItemContext = useRadioItemContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.radioContext().getRadioControlBindings({...this.radioItemContext()}),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
