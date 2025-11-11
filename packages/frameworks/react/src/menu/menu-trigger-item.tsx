// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {ChevronRight} from "lucide-react"

import {type ItemProps, splitMenuItemProps} from "@qualcomm-ui/core/menu"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {MenuItemContextProvider, useMenuTriggerItem} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context"

export interface MenuTriggerItemProps
  extends ItemProps,
    Omit<ElementRenderProp<"button">, "onSelect" | "value"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Icon to display next to the label, which indicates that this menu item is a
   * trigger for a submenu.
   *
   * @default ChevronRight
   */
  icon?: LucideIconOrElement
}

/**
 * A menu item that triggers a submenu on hover or click. Renders a `<button>`
 * element by default.
 */
export function MenuTriggerItem({
  children,
  icon = ChevronRight,
  id,
  ...props
}: MenuTriggerItemProps): ReactElement {
  const [menuItemProps, localProps] = splitMenuItemProps(props)
  const context = useMenuTriggerItem({id, ...menuItemProps})
  const qdsContext = useQdsMenuContext()
  const mergedProps = mergeProps(
    context.bindings ?? {},
    qdsContext.getItemBindings(),
    localProps,
  )

  return (
    <MenuItemContextProvider value={context.itemContextValue}>
      <PolymorphicElement as="button" {...mergedProps}>
        {children}
        <div {...qdsContext.getTriggerItemIndicatorBindings()}>
          <IconOrNode icon={icon} />
        </div>
      </PolymorphicElement>
    </MenuItemContextProvider>
  )
}
