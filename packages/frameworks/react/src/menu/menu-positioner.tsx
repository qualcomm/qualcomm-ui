// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useMenuPositioner} from "@qualcomm-ui/react-core/menu"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuPositionerProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A container that positions the menu relative to its anchor element. Renders a
 * `<div>` element by default.
 */
export function MenuPositioner({
  children,
  id,
  ...props
}: MenuPositionerProps): ReactElement | null {
  const contextProps = useMenuPositioner({id})
  if (!contextProps) {
    return null
  }
  const mergedProps = mergeProps(contextProps, props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
