// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsMenuContext} from "./qds-menu-context.service"

/**
 * The menu header text.
 */
@Directive({
  selector: "[q-menu-header-label]",
  standalone: false,
})
export class MenuHeaderLabelDirective implements OnInit {
  protected readonly qdsMenuContext = useQdsMenuContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsMenuContext().getHeaderLabelBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
