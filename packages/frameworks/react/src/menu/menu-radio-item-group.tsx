// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {RadioItemGroupContext} from "@qualcomm-ui/core/menu"
import {
  MenuRadioItemGroupContextProvider,
  useMenuRadioItemGroup,
} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import type {Optional} from "@qualcomm-ui/utils/guard"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context"

export interface MenuRadioItemGroupProps
  extends Optional<RadioItemGroupContext, "id">,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function MenuRadioItemGroup({
  children,
  id,
  onValueChange,
  value,
  ...props
}: MenuRadioItemGroupProps): ReactElement {
  const {bindings, itemGroupContextValue} = useMenuRadioItemGroup({
    id,
    onValueChange,
    value,
  })
  const qdsContext = useQdsMenuContext()
  const mergedProps = mergeProps(
    bindings,
    qdsContext.getItemGroupBindings(),
    props,
  )

  return (
    <MenuRadioItemGroupContextProvider value={itemGroupContextValue}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </MenuRadioItemGroupContextProvider>
  )
}
