// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input, type OnInit} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsInputContext} from "./qds-input-context.service"

@Component({
  imports: [IconDirective],
  selector: "[q-input-end-icon]",
  template: `
    <ng-content>
      @if (icon()) {
        <svg [qIcon]="icon()!"></svg>
      }
    </ng-content>
  `,
})
export class InputEndIconComponent implements OnInit {
  readonly icon = input<LucideIcon | string>()

  context = useQdsInputContext({optional: true})

  trackBindings = useTrackBindings(() => {
    const context = this.context?.()
    return context?.getEndIconBindings?.() || {}
  })

  ngOnInit() {
    this.trackBindings()
  }
}
