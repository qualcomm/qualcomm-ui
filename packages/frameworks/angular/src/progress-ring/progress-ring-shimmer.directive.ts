// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsProgressRingContext} from "./qds-progress-ring-context.service"

@Directive({
  selector: "circle[q-progress-ring-shimmer]",
  standalone: false,
})
export class ProgressRingShimmerDirective implements OnInit {
  protected readonly qdsContext = useQdsProgressRingContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getShimmerBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
