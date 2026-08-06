// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreTreeNodeIconDirective} from "@qualcomm-ui/angular-core/tree"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Component({
  host: {
    "[attr.data-size]": "qdsContext().size",
  },
  selector: "[q-tree-node-icon]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg [qIcon]="icon()" [size]="qdsContext().size" />
    }
    <ng-content />
  `,
})
export class TreeNodeIconDirective extends CoreTreeNodeIconDirective {
  readonly icon = input<LucideIconOrString>()

  protected readonly qdsContext = useQdsTreeContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getNodeIconBindings()),
    )
  }
}
