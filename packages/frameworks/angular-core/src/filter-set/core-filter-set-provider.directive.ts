// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject, input, type OnInit} from "@angular/core"

import type {FilterSetApi} from "@qualcomm-ui/core/filter-set"

import {FilterSetContextService} from "./filter-set-context.service"

/**
 * Provides a filter set created with `useFilterSet` to its descendants, such
 * as filter controls rendered outside a filter panel. Renders no element of its
 * own when used on an `<ng-container>`.
 */
@Directive()
export class CoreFilterSetProviderDirective implements OnInit {
  /**
   * A filter set API created with `useFilterSet`.
   *
   * @inheritDoc
   */
  readonly value = input.required<FilterSetApi<any>>()

  protected readonly filterSetContextService = inject(FilterSetContextService)

  ngOnInit() {
    this.filterSetContextService.init(this.value)
  }
}
