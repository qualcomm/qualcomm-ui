// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"
import {LucideChevronRight} from "@lucide/angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {provideRenderStrategyContext} from "@qualcomm-ui/angular-core/presence"
import {provideTreeContext} from "@qualcomm-ui/angular-core/tree"
import {provideQdsTreeContext} from "@qualcomm-ui/angular/tree"

import {provideJsonViewerOptionsContext} from "./json-viewer-options-context.service"
import {JsonViewerRootDirective} from "./json-viewer-root.directive"

@Component({
  exportAs: "jsonViewerRoot",
  providers: [
    provideTreeContext(),
    provideRenderStrategyContext(),
    provideQdsTreeContext(),
    provideJsonViewerOptionsContext(),
  ],
  selector: "[q-json-viewer]",
  standalone: false,
  template: `
    <div
      q-json-viewer-tree
      [arrow]="arrow()"
      [indentGuide]="indentGuide()"
    ></div>
  `,
})
export class JsonViewerComponent extends JsonViewerRootDirective {
  /**
   * Icon used for the branch expand/collapse trigger.
   *
   * @default LucideChevronRight
   */
  readonly arrow = input<LucideIconOrString>(LucideChevronRight)

  /**
   * Whether to render vertical indent guidelines for nested levels.
   *
   * @default true
   */
  readonly indentGuide = input<boolean>(true)
}
