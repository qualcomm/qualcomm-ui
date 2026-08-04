// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {ChevronRight} from "lucide-angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreTreeBranchTriggerDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Component({
  selector: "[q-tree-branch-trigger]",
  standalone: false,
  template: `
    <svg [qIcon]="icon()"></svg>
  `,
})
export class TreeBranchTriggerDirective extends CoreTreeBranchTriggerDirective {
  /**
   * @default ChevronRight
   */
  readonly icon = input<LucideIconOrString>(ChevronRight)

  protected qdsContext = useQdsTreeContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getBranchTriggerBindings()),
    )
  }
}
