// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useTourContext} from "./tour-context.service"

@Directive()
export class CoreTourHeadingDirective implements OnInit {
  readonly id = input<string>()

  private readonly hostId = computed(() => useId(this, this.id()))
  private readonly onDestroy = useOnDestroy()
  protected readonly tourContext = useTourContext()
  protected readonly trackBindings = useTrackBindings(() =>
    this.tourContext().getHeadingBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
