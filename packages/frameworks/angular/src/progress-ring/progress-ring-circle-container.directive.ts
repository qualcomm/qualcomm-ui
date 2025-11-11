// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsProgressRingContext} from "./qds-progress-ring-context.service"

@Directive({
  selector: "[q-progress-ring-circle-container]",
  standalone: false,
})
export class ProgressRingCircleContainerDirective implements OnInit {
  protected readonly qdsContext = useQdsProgressRingContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getCircleContainerBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
