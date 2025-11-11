// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  output,
} from "@angular/core"

import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {ItemProps} from "@qualcomm-ui/core/menu"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {useMenuContext} from "./menu-context.service"
import {MenuItemContextService} from "./menu-item-context.service"

/**
 * Each menu item type shares the same base properties.
 *
 * @public
 */
@Directive()
export class BaseMenuItemDirective implements SignalifyInput<ItemProps> {
  /**
   * Whether the menu should be closed when the option is selected.
   */
  readonly closeOnSelect = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether the menu item is disabled
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The unique value of the menu item option.
   */
  readonly value = input.required<string>()

  /**
   * The textual value of the option. Used in typeahead navigation of the menu.
   * If not provided, the text content of the menu item will be used.
   */
  readonly valueText = input<string>()

  /**
   * Emitted when the item is selected
   */
  readonly selected = output()

  protected readonly menuContext = useMenuContext()
  protected readonly menuItemService = inject(MenuItemContextService)

  readonly itemProps = computed<Explicit<ItemProps>>(() => ({
    closeOnSelect: this.closeOnSelect(),
    disabled: this.disabled(),
    onSelect: () => this.selected.emit(),
    value: this.value(),
    valueText: this.valueText(),
  }))
}
