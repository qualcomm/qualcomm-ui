// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {provideCheckboxContext} from "@qualcomm-ui/angular-core/checkbox"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"

import {SegmentedControlItemRootDirective} from "./segmented-control-item-root.directive.js"

@Component({
  providers: [provideCheckboxContext()],
  selector: "[q-segmented-control-item]",
  standalone: false,
  template: `
    <ng-content select="[q-segmented-control-item-icon]">
      @if (icon()) {
        <svg [qIcon]="icon()!"></svg>
      }
    </ng-content>
    <ng-content select="[q-segmented-control-item-text]">
      @if (text()) {
        <span q-segmented-control-item-text>{{ text() }}</span>
      }
    </ng-content>
    <ng-content select="[q-segmented-control-hidden-input]">
      <input q-segmented-control-hidden-input />
    </ng-content>
  `,
})
export class SegmentedControlItemComponent extends SegmentedControlItemRootDirective {
  readonly text = input<string>()
  readonly icon = input<LucideIcon | string>()
}
