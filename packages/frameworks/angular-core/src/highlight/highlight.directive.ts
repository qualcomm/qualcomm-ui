// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, computed, input} from "@angular/core"

import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import {highlightWord} from "@qualcomm-ui/utils/highlight-word"

@Component({
  selector: "[q-highlight]",
  standalone: true,
  template: `
    @for (chunk of chunks(); track $index) {
      @if (chunk.match) {
        <mark>{{ chunk.text }}</mark>
      } @else {
        {{ chunk.text }}
      }
    }
  `,
})
export class HighlightDirective {
  /**
   * Whether to match whole words only
   */
  readonly exactMatch = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to ignore case while matching
   */
  readonly ignoreCase = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to match multiple instances of the query
   */
  readonly matchAll = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The query to highlight in the text
   */
  readonly query = input.required<string | string[] | undefined>()

  /**
   * The text to highlight
   */
  readonly text = input.required<string | null | undefined>()

  readonly chunks = computed(() => {
    return highlightWord({
      exactMatch: this.exactMatch(),
      ignoreCase: this.ignoreCase(),
      matchAll: this.matchAll(),
      query: this.query() || "",
      text: this.text() || "",
    })
  })
}
