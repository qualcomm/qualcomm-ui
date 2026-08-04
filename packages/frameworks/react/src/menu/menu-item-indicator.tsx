// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Check} from "lucide-react"

import {useMenuItemIndicator} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Icon} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context.js"

export interface MenuItemIndicatorProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function MenuItemIndicator({
  children,
  ...props
}: MenuItemIndicatorProps): ReactElement {
  const contextProps = useMenuItemIndicator()
  const qdsContext = useQdsMenuContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getItemIndicatorBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
      <Icon icon={Check} />
    </PolymorphicElement>
  )
}
