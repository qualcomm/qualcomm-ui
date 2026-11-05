// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {LucideChevronDown} from "@lucide/angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreTreeBranchTriggerDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsSideNavContext} from "./qds-side-nav-context.service"

@Component({
  selector: "[q-side-nav-branch-trigger]",
  standalone: false,
  template: `
    <ng-content>
      @if (icon()) {
        <svg [qIcon]="icon()!" />
      }
    </ng-content>
  `,
})
export class SideNavBranchTriggerDirective extends CoreTreeBranchTriggerDirective {
  /**
   * The icon to display. This rotates by 180deg when the branch is expanded.
   *
   * @default LucideChevronDown
   */
  readonly icon = input<LucideIconOrString>(LucideChevronDown)

  protected qdsContext = useQdsSideNavContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBranchTriggerBindings()),
    )
  }
}
