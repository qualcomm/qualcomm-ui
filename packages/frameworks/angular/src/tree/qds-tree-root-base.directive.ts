// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {CoreTreeRootBaseDirective} from "@qualcomm-ui/angular-core/tree"
import {
  createQdsTreeApi,
  type QdsTreeApiProps,
  type QdsTreeSize,
} from "@qualcomm-ui/qds-core/tree"
import type {TreeNode} from "@qualcomm-ui/utils/collection"

import {QdsTreeContextService} from "./qds-tree-context.service"

@Directive()
export abstract class QdsTreeRootBaseDirective<T extends TreeNode = TreeNode>
  extends CoreTreeRootBaseDirective<T>
  implements SignalifyInput<QdsTreeApiProps>, OnInit
{
  /**
   * The size of the tree and its elements. Governs properties like font size,
   * item padding, and icon sizes.
   *
   * @default 'md'
   */
  readonly size = input<QdsTreeSize>()

  protected readonly qdsTreeService = inject(QdsTreeContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsTreeService.context().getRootBindings()),
    )
  }

  override ngOnInit() {
    this.qdsTreeService.init(
      computed(() => createQdsTreeApi({size: this.size()}, normalizeProps)),
    )

    super.ngOnInit()
  }
}
