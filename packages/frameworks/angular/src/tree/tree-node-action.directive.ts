// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreTreeNodeActionDirective} from "@qualcomm-ui/angular-core/tree"
import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import type {QdsInlineIconButtonSize} from "@qualcomm-ui/qds-core/inline-icon-button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTreeContext} from "./qds-tree-context.service"

@Component({
  selector: "[q-tree-node-action]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg
        [q-bind]="inlineIconButtonApi().getIconBindings()"
        [qIcon]="icon()!"
      ></svg>
    }
    <ng-content />
  `,
})
export class TreeNodeActionDirective extends CoreTreeNodeActionDirective {
  /**
   * Lucide icon to display inside the button.
   */
  readonly icon = input<LucideIconOrString>()

  /**
   * The size of the button and its icon.
   *
   * @default 'md'
   */
  readonly size = input<QdsInlineIconButtonSize>("md")

  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: this.size(),
    variant: "fixed",
  })

  protected readonly qdsContext = useQdsTreeContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.inlineIconButtonApi().getRootBindings(),
          this.qdsContext().getNodeActionBindings(),
        ),
      ),
    )
  }
}
