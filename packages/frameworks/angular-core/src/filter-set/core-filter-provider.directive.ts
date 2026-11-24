// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {createFilterState} from "@qualcomm-ui/core/filter-set"
import type {
  FilterDefinition,
  IdentifiedFilterDefinition,
} from "@qualcomm-ui/core/filters"

import {FilterContextService} from "./filter-context.service"
import {useFilterSetContext} from "./filter-set-context.service"

/**
 * Provides one filter's state from the surrounding filter set to its controls.
 * Renders no element of its own when used on an `<ng-container>`. Controls
 * render nothing when `filter` is missing.
 */
@Directive()
export class CoreFilterProviderDirective<
  TDef extends FilterDefinition = FilterDefinition,
> implements OnInit {
  /**
   * The filter's definition, from the filter set's `filters`.
   *
   * @inheritDoc
   */
  readonly filter = input.required<IdentifiedFilterDefinition<TDef>>()

  /**
   * The id of the element that labels the filter. Controls reference it with
   * `aria-labelledby`. When omitted, controls use the filter's label as their
   * `aria-label`.
   */
  readonly labelId = input<string>()

  protected readonly filterSetContext = useFilterSetContext()

  protected readonly filterContextService = inject(FilterContextService)

  ngOnInit() {
    this.filterContextService.init(
      computed(() =>
        createFilterState(this.filterSetContext(), this.filter(), {
          labelId: this.labelId(),
        }),
      ),
    )
  }
}
