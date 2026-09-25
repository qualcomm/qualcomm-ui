// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"
import {ChevronRight} from "lucide-angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"

@Component({
  selector: "q-json-viewer",
  standalone: false,
  template: `
    <q-json-viewer-root
      [collapseStringsAfterLength]="collapseStringsAfterLength()"
      [data]="data()"
      [defaultExpandedDepth]="defaultExpandedDepth()"
      [groupArraysAfterLength]="groupArraysAfterLength()"
      [maxPreviewItems]="maxPreviewItems()"
      [quotesOnKeys]="quotesOnKeys()"
      [showNonenumerable]="showNonenumerable()"
    >
      <q-json-viewer-tree [arrow]="arrow()" [indentGuide]="indentGuide()" />
    </q-json-viewer-root>
  `,
})
export class JsonViewerComponent {
  /**
   * The data to display in the JSON viewer. Accepts any JavaScript value.
   */
  readonly data = input.required<unknown>()

  /**
   * The default depth to expand the tree to.
   *
   * @default 0
   */
  readonly defaultExpandedDepth = input<number>(0)

  /**
   * Icon used for the branch expand/collapse trigger.
   *
   * @default ChevronRight
   */
  readonly arrow = input<LucideIconOrString>(ChevronRight)

  /**
   * Whether to render vertical indent guidelines for nested levels.
   *
   * @default true
   */
  readonly indentGuide = input<boolean>(true)

  /**
   * Whether to wrap property keys in double quotes.
   *
   * @default false
   */
  readonly quotesOnKeys = input<boolean>()

  /**
   * Maximum number of items shown in a collapsed container preview.
   *
   * @default 3
   */
  readonly maxPreviewItems = input<number>()

  /**
   * Truncates string values longer than this character count in the preview.
   *
   * @default 30
   */
  readonly collapseStringsAfterLength = input<number>()

  /**
   * Groups array entries into chunks when the array length exceeds this value.
   *
   * @default 100
   */
  readonly groupArraysAfterLength = input<number>()

  /**
   * Whether to display non-enumerable properties (e.g. prototype methods).
   *
   * @default true
   */
  readonly showNonenumerable = input<boolean>()
}
