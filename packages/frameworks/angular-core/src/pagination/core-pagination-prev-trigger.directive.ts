// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {usePaginationContext} from "./pagination-context.service"

@Directive()
export class CorePaginationPrevTriggerDirective implements OnInit {
  readonly paginationContext = usePaginationContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.paginationContext().getPrevTriggerBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
