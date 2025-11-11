// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {Directive, inject, Injector, type OnInit} from "@angular/core"

import {
  CoreAccordionItemDirective,
  provideAccordionItemContext,
} from "@qualcomm-ui/angular-core/accordion"
import {provideCollapsibleContext} from "@qualcomm-ui/angular-core/collapsible"
import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"

/**
 * The composite form of the accordion item. Use when you need complete control over
 * the accordion item and its subcomponents.
 *
 * @example
 * ```angular-html
 * <div q-accordion-item-root value="a">
 *   <button q-accordion-item-trigger icon="...">
 *     <span q-accordion-item-text>...</span>
 *     <span q-accordion-item-secondary-text>...</span>
 *     <q-accordion-item-indicator />
 *   </button>
 *   <div q-accordion-item-content>
 *     ...
 *   </div>
 * </div>
 * ```
 */
@Directive({
  host: {
    "[class]": "accordionClasses.item",
  },
  providers: [provideAccordionItemContext(), provideCollapsibleContext()],
  selector: "[q-accordion-item-root]",
  standalone: false,
})
export class AccordionItemRootComponent
  extends CoreAccordionItemDirective
  implements OnInit
{
  protected readonly accordionClasses = accordionClasses

  protected readonly injector = inject(Injector)

  protected readonly document = inject(DOCUMENT)
}
