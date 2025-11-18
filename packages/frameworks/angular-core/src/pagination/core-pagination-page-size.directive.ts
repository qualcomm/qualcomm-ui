// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {usePaginationContext} from "./pagination-context.service"

@Directive()
export class CorePaginationPageSizeDirective implements OnInit {
  readonly paginationContext = usePaginationContext()

  /**
   * Available page sizes to choose from.
   */
  readonly options = input.required<number[]>()

  readonly menuOptions = computed<string[]>(() =>
    this.options().map((opt) => `${opt}`),
  )

  readonly inputAriaLabel = computed(() => {
    const pageSizeLabelId = this.paginationContext().pageSizeLabelId
    return pageSizeLabelId ? undefined : "Page Size"
  })

  readonly inputAriaLabelledBy = computed(() => {
    return this.paginationContext().pageSizeLabelId || undefined
  })

  protected inputOptionChanged(value: string) {
    this.paginationContext().setPageSize(parseInt(value))
  }

  readonly currentValue = computed<string>(() => {
    return `${this.paginationContext().pageSize}`
  })

  protected readonly trackBindings = useTrackBindings(() =>
    this.paginationContext().getPageSizeBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
