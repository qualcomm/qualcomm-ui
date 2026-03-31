// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {
  QDS_BREADCRUMB_ITEM,
  useQdsBreadcrumbsContext,
} from "./qds-breadcrumbs-context.service"

@Directive({
  host: {"[attr.aria-describedby]": "ariaDescribedby()"},
  selector: "[q-breadcrumb-item-trigger]",
  standalone: false,
})
export class BreadcrumbItemTriggerDirective implements OnInit {
  protected readonly qdsContext = useQdsBreadcrumbsContext()

  private readonly item = inject(QDS_BREADCRUMB_ITEM, {optional: true})

  protected readonly ariaDescribedby = () => this.item?.tooltipId() ?? null

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getItemTriggerBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
