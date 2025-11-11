// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {tooltipClasses} from "@qualcomm-ui/qds-core/tooltip"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useTooltipPositioner} from "@qualcomm-ui/react-core/tooltip"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TooltipPositionerProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The element that positions the tooltip content relative to the trigger. Renders a
 * `<div>` element by default.
 */
export function TooltipPositioner({
  children,
  id,
  ...props
}: TooltipPositionerProps): ReactElement {
  const contextProps = useTooltipPositioner({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: tooltipClasses.positioner},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
