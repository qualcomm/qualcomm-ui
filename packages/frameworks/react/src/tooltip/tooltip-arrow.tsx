// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {tooltipClasses} from "@qualcomm-ui/qds-core/tooltip"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useTooltipArrow} from "@qualcomm-ui/react-core/tooltip"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {TooltipArrowTip} from "./tooltip-arrow-tip"

export interface TooltipArrowProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The container that positions the arrow. This element renders the
 * `<Tooltip.ArrowTip/>` by default if no children are provided.
 */
export function TooltipArrow({
  children = <TooltipArrowTip />,
  id,
  ...props
}: TooltipArrowProps): ReactElement {
  const contextProps = useTooltipArrow({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: tooltipClasses.arrow},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
