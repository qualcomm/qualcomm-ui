// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {
  CoreFilterSetProviderDirective,
  provideFilterSetContext,
} from "@qualcomm-ui/angular-core/filter-set"

/**
 * Provides a filter set created with `useFilterSet` to its descendants, so that
 * filter controls render without a filter panel. Renders no element of its own
 * when used on an `<ng-container>`.
 *
 * @example
 * ```angular-html
 * <ng-container q-filter-set-provider [value]="filterSet()">
 *   <ng-container q-filter-provider [filter]="filters.status">
 *     <q-checkbox-group-filter />
 *   </ng-container>
 * </ng-container>
 * ```
 */
@Directive({
  providers: [provideFilterSetContext()],
  selector: "[q-filter-set-provider]",
  standalone: false,
})
export class FilterSetProviderDirective extends CoreFilterSetProviderDirective {}
