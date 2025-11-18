// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {PageItem} from "@qualcomm-ui/core/pagination"

import {usePaginationContext} from "./pagination-context.service"

@Directive()
export class CorePaginationPageItemDirective implements OnInit {
  readonly paginationContext = usePaginationContext()

  /**
   * The computed page item from context.
   */
  readonly item = input.required<PageItem>()

  readonly itemProps = computed(() =>
    this.paginationContext().getPageItemBindings(this.item()),
  )

  protected trackBindings = useTrackBindings(() => this.itemProps())

  ngOnInit() {
    this.trackBindings()
  }
}
