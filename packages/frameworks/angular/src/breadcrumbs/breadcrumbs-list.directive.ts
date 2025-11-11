// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context.service"

@Directive({
  selector: "[q-breadcrumbs-list]",
  standalone: false,
})
export class BreadcrumbsListDirective implements OnInit {
  protected readonly qdsContext = useQdsBreadcrumbsContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getListBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
