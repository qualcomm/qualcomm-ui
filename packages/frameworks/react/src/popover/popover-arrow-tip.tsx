// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {popoverClasses} from "@qualcomm-ui/qds-core/popover"
import {usePopoverArrowTip} from "@qualcomm-ui/react-core/popover"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PopoverArrowTipProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function PopoverArrowTip({
  children,
  ...props
}: PopoverArrowTipProps): ReactElement {
  const contextProps = usePopoverArrowTip()

  const mergedProps = mergeProps(
    contextProps,
    {className: popoverClasses.arrowTip},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
