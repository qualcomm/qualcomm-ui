// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useNumberInputContext} from "./number-input-context.service"

@Directive()
export class CoreNumberInputHintDirective implements OnInit {
  readonly id = input<string>()

  protected readonly numberInputContext = useNumberInputContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.numberInputContext().getHintBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    })
  })

  private readonly hostId = computed(() => useId(this, this.id()))

  private readonly onDestroy = useOnDestroy()

  ngOnInit() {
    this.trackBindings()
  }
}
