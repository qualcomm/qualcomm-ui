// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useMenuContext} from "./menu-context.service"
import {useMenuOptionItemContext} from "./menu-option-item-context.service"

@Directive()
export class CoreMenuOptionItemControlDirective implements OnInit {
  protected readonly menuContext = useMenuContext()
  protected readonly menuOptionItemContext = useMenuOptionItemContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.menuContext().getOptionItemControlBindings(
      this.menuOptionItemContext(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
