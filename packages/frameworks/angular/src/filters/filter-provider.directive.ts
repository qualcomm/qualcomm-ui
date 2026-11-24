// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {
  CoreFilterProviderDirective,
  provideFilterContext,
} from "@qualcomm-ui/angular-core/filter-set"
import type {FilterDefinition} from "@qualcomm-ui/core/filters"

/**
 * Provides one filter's state from the surrounding filter set to its controls.
 * Renders no element of its own when used on an `<ng-container>`. Controls
 * render nothing when `filter` is missing.
 */
@Directive({
  providers: [provideFilterContext()],
  selector: "[q-filter-provider]",
  standalone: false,
})
export class FilterProviderDirective<
  TDef extends FilterDefinition = FilterDefinition,
> extends CoreFilterProviderDirective<TDef> {}
