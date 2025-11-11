// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  type OnInit,
} from "@angular/core"
import type {VirtualItem} from "@tanstack/virtual-core"

import {
  ComboboxItemContextService,
  provideComboboxItemContext,
  useComboboxContext,
} from "@qualcomm-ui/angular-core/combobox"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {ComboboxApiItemProps} from "@qualcomm-ui/core/combobox"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

/**
 * Virtual item renderer. Only intended to be used as a child of the
 * `q-combobox-virtual-content` directive.
 */
@Directive({
  host: {
    "[style.--virtual-item-start]": "virtualItemStart()",
  },
  providers: [provideComboboxItemContext()],
  selector: "[q-combobox-virtual-item]",
  standalone: false,
})
export class ComboboxVirtualItemDirective implements OnInit {
  protected readonly qdsComboboxContext = useQdsComboboxContext()

  /**
   * A virtual item returned from `virtualizer.getVirtualItems()`
   */
  readonly virtualItem = input.required<VirtualItem>()

  /**
   * Whether hovering outside should clear the highlighted state
   */
  readonly persistFocus = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  protected readonly comboboxContext = useComboboxContext()

  protected readonly comboboxItemService = inject(ComboboxItemContextService)

  readonly virtualItemStart = computed(() => {
    const virtualItem = this.virtualItem()
    return `${virtualItem.start}px`
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.comboboxContext().getItemBindings(
        this.comboboxItemService.context(),
      ),
      this.qdsComboboxContext().getItemBindings(),
      {"data-virtual": ""},
    ),
  )

  ngOnInit() {
    this.comboboxItemService.init(
      computed(() =>
        this.comboboxContext().getItemState({
          item: this.comboboxContext().collection.items.at(
            this.virtualItem().index,
          )!,
          persistFocus: this.persistFocus(),
        } satisfies Explicit<ComboboxApiItemProps<CollectionItem>>),
      ),
    )

    this.trackBindings()
  }
}
