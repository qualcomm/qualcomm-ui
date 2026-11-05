// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {MenuTriggerDirective} from "@qualcomm-ui/angular/menu"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context.service"

/**
 * @since 2.6.0
 */
@Directive({
  selector: "[q-breadcrumb-overflow-trigger]",
  standalone: false,
})
export class BreadcrumbOverflowTriggerDirective extends MenuTriggerDirective {
  private readonly qdsContext = useQdsBreadcrumbsContext()

  private readonly overflowBindings = computed(() =>
    this.qdsContext().getOverflowTriggerBindings(),
  )

  constructor() {
    super()
    this.trackBindings.extendWith(this.overflowBindings)
  }
}
