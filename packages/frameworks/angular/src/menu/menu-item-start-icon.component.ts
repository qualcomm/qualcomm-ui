// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input, type OnInit} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Component({
  selector: "[q-menu-item-start-icon]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg [qIcon]="icon()!" />
    }
    <ng-content />
  `,
})
export class MenuItemStartIconComponent implements OnInit {
  readonly icon = input<LucideIconOrString>()

  readonly qdsMenuContext = useQdsMenuContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsMenuContext().getItemStartIconBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
