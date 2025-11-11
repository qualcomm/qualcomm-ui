// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {PageItem} from "@qualcomm-ui/core/pagination"

import {usePaginationContext} from "./pagination-context.service"

@Directive()
export class CorePaginationPageItemsDirective implements OnInit {
  readonly paginationContext = usePaginationContext()

  protected trackPageItem = (item: PageItem, itemIndex: number) => {
    return item.type === "separator" ? itemIndex : `${item.type}-${item.page}`
  }

  private readonly trackBindings = useTrackBindings(() =>
    this.paginationContext().getPageItemsBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
