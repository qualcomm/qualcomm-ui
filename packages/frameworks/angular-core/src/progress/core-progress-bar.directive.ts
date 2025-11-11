// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useProgressContext} from "./progress-context.service"

@Directive()
export class CoreProgressBarDirective implements OnInit {
  protected readonly progressContext = useProgressContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.progressContext().getBarBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
