// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, computed, Directive, input} from "@angular/core"

import {
  CoreAccordionRootDirective,
  provideAccordionContext,
} from "@qualcomm-ui/angular-core/accordion"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  getQdsAccordionBindings,
  type QdsAccordionSize,
} from "@qualcomm-ui/qds-core/accordion"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

@Directive({
  providers: [provideAccordionContext()],
  selector: "[q-accordion]",
  standalone: false,
})
export class AccordionComponent extends CoreAccordionRootDirective {
  /**
   * The uncontained aspect of the accordion that removes horizontal margins.
   */
  readonly uncontained = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The size of the accordion.
   * @default 'md'
   */
  readonly size = input<QdsAccordionSize | undefined>()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        getQdsAccordionBindings(
          {size: this.size(), uncontained: this.uncontained()},
          normalizeProps,
        ),
      ),
    )
  }
}
