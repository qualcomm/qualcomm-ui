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

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {ComboboxApiItemProps} from "@qualcomm-ui/core/combobox"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {useComboboxContext} from "./combobox-context.service"
import {ComboboxItemContextService} from "./combobox-item-context.service"

@Directive()
export class CoreComboboxItemDirective
  implements SignalifyInput<ComboboxApiItemProps<CollectionItem>>, OnInit
{
  /**
   * The item to render, from the collection
   */
  readonly item = input<CollectionItem>()

  /**
   * Whether hovering outside should clear the highlighted state
   */
  readonly persistFocus = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  protected readonly comboboxContext = useComboboxContext()

  protected readonly comboboxItemService = inject(ComboboxItemContextService)

  protected readonly trackBindings = useTrackBindings(() =>
    this.comboboxContext().getItemBindings(this.comboboxItemService.context()),
  )

  ngOnInit() {
    this.comboboxItemService.init(
      computed(() =>
        this.comboboxContext().getItemState({
          item: this.item(),
          persistFocus: this.persistFocus(),
        } satisfies Explicit<ComboboxApiItemProps<CollectionItem>>),
      ),
    )

    this.trackBindings()
  }
}
