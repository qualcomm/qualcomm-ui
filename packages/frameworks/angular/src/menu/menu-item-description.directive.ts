// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Directive({
  selector: "[q-menu-item-description]",
  standalone: false,
})
export class MenuItemDescriptionDirective implements OnInit {
  protected readonly qdsMenuContext = useQdsMenuContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsMenuContext().getMenuItemDescriptionBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
