// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useToastContext} from "./toast-context.service"

@Directive()
export class CoreToastLabelDirective implements OnInit {
  protected readonly toastContext = useToastContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.toastContext().getLabelBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
