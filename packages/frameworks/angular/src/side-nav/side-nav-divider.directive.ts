// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {createQdsDividerApi} from "@qualcomm-ui/qds-core/divider"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSideNavContext} from "./qds-side-nav-context.service"

@Directive({
  selector: "[q-side-nav-divider]",
  standalone: false,
})
export class SideNavDividerDirective implements OnInit {
  protected readonly qdsContext = useQdsSideNavContext()

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      createQdsDividerApi({}, normalizeProps).getRootBindings(),
      this.qdsContext().getDividerBindings(),
      {"aria-orientation": undefined, role: "presentation"},
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
