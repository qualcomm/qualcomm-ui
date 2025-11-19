// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {ThumbProps} from "@qualcomm-ui/core/slider"
import {
  SliderThumbContextProvider,
  useSliderThumb,
} from "@qualcomm-ui/react-core/slider"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSliderContext} from "./qds-slider-context"

export interface SliderThumbProps
  extends IdProp,
    ThumbProps,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The draggable handle. Renders a `<div>` element by default.
 */
export function SliderThumb({
  children,
  id,
  index,
  name,
  ...props
}: SliderThumbProps): ReactElement {
  const contextProps = useSliderThumb({id, index, name})
  const qdsContext = useQdsSliderContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getThumbBindings(),
    props,
  )

  return (
    <SliderThumbContextProvider value={{index, name}}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </SliderThumbContextProvider>
  )
}
