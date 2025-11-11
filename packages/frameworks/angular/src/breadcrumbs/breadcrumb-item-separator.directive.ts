// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context.service"

@Directive({
  selector: "[q-breadcrumb-item-separator]",
  standalone: false,
})
export class BreadcrumbItemSeparatorDirective implements OnInit {
  protected readonly qdsContext = useQdsBreadcrumbsContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getItemSeparatorBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
