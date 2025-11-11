// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useSliderErrorText} from "@qualcomm-ui/react-core/slider"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSliderContext} from "./qds-slider-context"

export interface SliderErrorTextProps
  extends IdProp,
    ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The error message below the slider. Renders a `<span>` element by default.
 */
export function SliderErrorText({
  children,
  id,
  ...props
}: SliderErrorTextProps): ReactElement {
  const contextProps = useSliderErrorText({id})
  const qdsContext = useQdsSliderContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getErrorTextBindings(),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
