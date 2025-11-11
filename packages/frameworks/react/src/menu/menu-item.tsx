// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {type ItemProps, splitMenuItemProps} from "@qualcomm-ui/core/menu"
import {
  MenuItemContextProvider,
  useMenuItem,
} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context"

export interface MenuItemProps
  extends ItemProps,
    Omit<ElementRenderProp<"button">, "onSelect" | "value"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function MenuItem({children, ...props}: MenuItemProps): ReactElement {
  const [menuItemProps, localProps] = splitMenuItemProps(props)
  const {bindings, itemContextValue} = useMenuItem(menuItemProps)
  const qdsContext = useQdsMenuContext()
  const mergedProps = mergeProps(
    bindings,
    qdsContext.getItemBindings(),
    localProps,
  )

  return (
    <MenuItemContextProvider value={itemContextValue}>
      <PolymorphicElement as="button" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </MenuItemContextProvider>
  )
}
