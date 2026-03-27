// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context.service"

@Directive({
  selector: "[q-breadcrumb-item-tooltip]",
  standalone: false,
})
export class BreadcrumbItemTooltipDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly qdsContext = useQdsBreadcrumbsContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getItemTooltipBindings({id: this.hostId()}),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
