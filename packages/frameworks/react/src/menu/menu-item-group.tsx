// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  MenuItemGroupContextProvider,
  useMenuItemGroup,
} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context"

export interface MenuItemGroupProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * id for this item group.
   */
  id?: string
}

export function MenuItemGroup({
  children,
  id,
  ...props
}: MenuItemGroupProps): ReactElement {
  const {bindings, itemGroupContextValue} = useMenuItemGroup({id})
  const qdsContext = useQdsMenuContext()
  const mergedProps = mergeProps(
    bindings,
    qdsContext.getItemGroupBindings(),
    props,
  )

  return (
    <MenuItemGroupContextProvider value={itemGroupContextValue}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </MenuItemGroupContextProvider>
  )
}
