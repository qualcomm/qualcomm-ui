// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useTourContext} from "./tour-context.service"

@Directive()
export class CoreTourProgressTextDirective implements OnInit {
  protected readonly tourContext = useTourContext()
  protected readonly trackBindings = useTrackBindings(() =>
    this.tourContext().getProgressTextBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
