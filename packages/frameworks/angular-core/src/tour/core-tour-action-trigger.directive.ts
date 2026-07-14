// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {TourStepAction} from "@qualcomm-ui/core/tour"

import {useTourContext} from "./tour-context.service"

@Directive()
export class CoreTourActionTriggerDirective implements OnInit {
  readonly action = input.required<TourStepAction>()

  protected readonly tourContext = useTourContext()
  protected readonly trackBindings = useTrackBindings(() =>
    this.tourContext().getActionTriggerBindings(this.action()),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
