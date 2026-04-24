// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsCardContext} from "./qds-card-context.service"

@Directive({
  selector: "[q-card-menu-trigger]",
  standalone: false,
})
export class CardMenuTriggerDirective implements OnInit {
  protected readonly qdsCardContext = useQdsCardContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsCardContext().getMenuTriggerBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
