// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useProgressRingContext} from "./progress-ring-context.service"

@Directive()
export class CoreProgressRingValueTextDirective implements OnInit {
  protected readonly progressRingContext = useProgressRingContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.progressRingContext().getValueTextBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
