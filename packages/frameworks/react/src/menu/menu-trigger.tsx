// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {MenuTriggerBindings} from "@qualcomm-ui/core/menu"
import {useMenuTrigger} from "@qualcomm-ui/react-core/menu"
import {
  type BindingRenderProp,
  bindingRenderProp,
} from "@qualcomm-ui/react-core/system"

export interface MenuTriggerProps {
  /**
   * React children {@link
   * https://react-next.qui.qualcomm.com/render-props#binding-render-prop
   * Render Prop}
   *
   * @inheritDoc
   */
  children: BindingRenderProp<MenuTriggerBindings>

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be automatically generated for accessibility.
   */
  id?: string
}

/**
 * Enhances a child element to open the menu when clicked. Requires a single child
 * element.
 *
 * @example
 * ```tsx
 * <Menu.Trigger>
 *   <button>Open</button>
 * </Menu.Trigger>
 * ```
 */
export function MenuTrigger({children, id}: MenuTriggerProps): ReactNode {
  const menuTriggerBindings = useMenuTrigger({id})

  return bindingRenderProp(children, menuTriggerBindings)
}
