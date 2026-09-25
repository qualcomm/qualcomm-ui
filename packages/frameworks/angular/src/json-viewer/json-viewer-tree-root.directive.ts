// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, type OnInit} from "@angular/core"

import {QdsTreeContextService} from "@qualcomm-ui/angular/tree"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {CoreTreeRootDirective} from "@qualcomm-ui/angular-core/tree"
import {createQdsTreeApi} from "@qualcomm-ui/qds-core/tree"
import type {JsonNode} from "@qualcomm-ui/utils/json-tree"

/**
 * Lightweight tree root directive for JSON viewer that reuses the parent
 * component's TreeContextService instead of providing its own. This avoids
 * the Angular content projection DI issue where projected content can't see
 * providers on directives inside the host component's template.
 */
@Directive({
  selector: "[q-json-viewer-tree-root]",
  standalone: false,
})
export class JsonViewerTreeRootDirective
  extends CoreTreeRootDirective<JsonNode>
  implements OnInit
{
  private readonly qdsTreeService = inject(QdsTreeContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsTreeService.context().getRootBindings()),
    )
  }

  override ngOnInit() {
    this.qdsTreeService.init(
      computed(() => createQdsTreeApi({size: undefined}, normalizeProps)),
    )
    super.ngOnInit()
  }
}
