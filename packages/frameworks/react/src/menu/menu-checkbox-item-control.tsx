// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {CheckmarkIcon} from "@qualcomm-ui/react/checkmark"
import {useMenuOptionItemControl} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context"

export interface MenuCheckboxItemControlProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   *
   * @default `<Checkbox.IndicatorIcon />`
   */
  children?: ReactNode
}

export function MenuCheckboxItemControl({
  children = <CheckmarkIcon indeterminate={false} />,
  ...props
}: MenuCheckboxItemControlProps): ReactElement {
  const contextProps = useMenuOptionItemControl()
  const qdsContext = useQdsMenuContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getCheckboxItemControlBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
