// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {usePaginationContext} from "./pagination-context.service"

@Directive()
export class CorePaginationPageSizeLabelDirective implements OnInit {
  readonly paginationContext = usePaginationContext()

  readonly id = input<string>()

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly onDestroy = useOnDestroy()

  protected readonly trackBindings = useTrackBindings(() =>
    this.paginationContext().getPageSizeLabelBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
