// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type CheckboxOptionItemProps,
  splitMenuOptionItemProps,
} from "@qualcomm-ui/core/menu"
import {
  MenuItemContextProvider,
  MenuOptionItemContextProvider,
  useMenuCheckboxItem,
} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context"

export interface MenuCheckboxItemProps
  extends CheckboxOptionItemProps,
    Omit<ElementRenderProp<"button">, "onSelect" | "value"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function MenuCheckboxItem({
  children,
  ...props
}: MenuCheckboxItemProps): ReactElement {
  const [optionItemProps, localProps] = splitMenuOptionItemProps({
    ...props,
    type: "checkbox",
  })
  const {bindings, optionItemContextValue} =
    useMenuCheckboxItem(optionItemProps)
  const qdsContext = useQdsMenuContext()
  const mergedProps = mergeProps(
    bindings,
    qdsContext.getRadioItemBindings(),
    localProps,
  )

  return (
    <MenuOptionItemContextProvider value={optionItemContextValue}>
      <MenuItemContextProvider value={optionItemContextValue}>
        <PolymorphicElement as="button" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </MenuItemContextProvider>
    </MenuOptionItemContextProvider>
  )
}
