// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useSliderThumbIndicator} from "@qualcomm-ui/react-core/slider"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSliderContext} from "./qds-slider-context.js"

export interface SliderThumbIndicatorProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
  /**
   * Custom value display: a function that receives the value array and returns a
   * React node.
   *
   * @default ' - '
   */
  display?: (value: number) => ReactNode
}

/**
 * The indicator shown above the slider thumb. Renders a `<div>` element by
 * default.
 */
export function SliderThumbIndicator({
  children,
  display,
  id,
  ...props
}: SliderThumbIndicatorProps): ReactElement {
  const {bindings: contextProps, value} = useSliderThumbIndicator({id})
  const qdsContext = useQdsSliderContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getThumbIndicatorBindings(),
    props,
  )

  const valueText = typeof display === "function" ? display(value) : value

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children || valueText}
    </PolymorphicElement>
  )
}
