// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {OptionItemProps} from "@qualcomm-ui/core/menu"

import {BaseMenuItemDirective} from "./base-menu-item.directive"
import {MenuOptionItemContextService} from "./menu-option-item-context.service"
import {useMenuRadioItemGroupContext} from "./menu-radio-item-group-context.service"

@Directive()
export class CoreMenuRadioItemDirective
  extends BaseMenuItemDirective
  implements OnInit
{
  protected readonly menuOptionItemService = inject(
    MenuOptionItemContextService,
  )
  protected readonly menuRadioItemGroupContext = useMenuRadioItemGroupContext()

  readonly optionItemProps = computed<OptionItemProps>(() => {
    const props = this.itemProps()
    const itemGroup = this.menuRadioItemGroupContext()
    return {
      ...props,
      checked: itemGroup.value === props.value,
      onCheckedChange: () => itemGroup.onValueChange?.(props.value),
      type: "radio",
    }
  })

  protected readonly trackBindings = useTrackBindings(() => {
    return this.menuContext().getOptionItemBindings(this.optionItemProps())
  })

  ngOnInit() {
    this.trackBindings()

    this.menuOptionItemService.init(
      computed(() => {
        const optionItemProps = this.optionItemProps()
        return {
          ...optionItemProps,
          ...this.menuContext().getItemState(optionItemProps),
        }
      }),
    )
  }
}
