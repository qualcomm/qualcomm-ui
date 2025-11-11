// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {usePopoverIndicator} from "@qualcomm-ui/react-core/popover"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"

export interface PopoverIndicatorProps extends ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function PopoverIndicator({
  children,
  ...props
}: PopoverIndicatorProps): ReactElement {
  const contextProps = usePopoverIndicator()

  return (
    <PolymorphicElement as="span" {...contextProps} {...props}>
      {children}
    </PolymorphicElement>
  )
}
