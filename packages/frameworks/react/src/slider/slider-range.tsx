// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useSliderRange} from "@qualcomm-ui/react-core/slider"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSliderContext} from "./qds-slider-context"

export interface SliderRangeProps extends IdProp, ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The filled portion of the track. Renders a `<div>` element by default.
 */
export function SliderRange({
  children,
  id,
  ...props
}: SliderRangeProps): ReactElement {
  const contextProps = useSliderRange({id})
  const qdsContext = useQdsSliderContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getRangeBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
