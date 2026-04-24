// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {useSideNavContext} from "@qualcomm-ui/angular-core/side-nav"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSideNavContext} from "./qds-side-nav-context.service"

@Directive({
  selector: "[q-side-nav-filter-input]",
  standalone: false,
})
export class SideNavFilterInputDirective implements OnInit {
  protected readonly sideNavContext = useSideNavContext()
  protected readonly qdsContext = useQdsSideNavContext()

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.sideNavContext().getFilterInputBindings(),
      this.qdsContext().getFilterInputBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
