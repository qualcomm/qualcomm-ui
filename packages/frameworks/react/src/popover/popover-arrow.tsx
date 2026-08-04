// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {usePopoverArrow} from "@qualcomm-ui/react-core/popover"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {PopoverArrowTip} from "./popover-arrow-tip.js"
import {useQdsPopoverContext} from "./qds-popover-context.js"

export interface PopoverArrowProps extends IdProp, ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function PopoverArrow({
  children = <PopoverArrowTip />,
  id,
  ...props
}: PopoverArrowProps): ReactElement {
  const contextProps = usePopoverArrow({id})
  const qdsPopover = useQdsPopoverContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsPopover.getArrowBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
