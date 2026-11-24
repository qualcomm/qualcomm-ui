// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input, type OnInit} from "@angular/core"

import type {FilterSetApi} from "@qualcomm-ui/core/filter-set"

import {CoreFilterPanelRootBaseDirective} from "./core-filter-panel-root-base.directive"

@Directive()
export class CoreFilterPanelRootProviderDirective
  extends CoreFilterPanelRootBaseDirective
  implements OnInit
{
  /**
   * A filter set API created with `useFilterSet`.
   *
   * @inheritDoc
   */
  readonly value = input.required<FilterSetApi<any>>()

  ngOnInit() {
    this.initFilterPanel(this.value)
  }
}
