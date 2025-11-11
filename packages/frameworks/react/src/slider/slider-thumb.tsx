// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {ThumbProps} from "@qualcomm-ui/core/slider"
import {Tooltip} from "@qualcomm-ui/react/tooltip"
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

  /**
   * Whether to display the thumb value as a tooltip.
   */
  tooltip?: boolean
}

/**
 * The draggable handle. Renders a `<div>` element by default.
 */
export function SliderThumb({
  children,
  id,
  index,
  name,
  tooltip,
  ...props
}: SliderThumbProps): ReactElement {
  const {bindings, value} = useSliderThumb({id, index, name})
  const qdsContext = useQdsSliderContext()
  const mergedProps = mergeProps(bindings, qdsContext.getThumbBindings(), props)

  const thumbElement = (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )

  return (
    <SliderThumbContextProvider value={{index, name}}>
      {tooltip ? (
        <Tooltip
          closeOnClick={false}
          positioning={{flip: false}}
          trigger={thumbElement}
        >
          {value}
        </Tooltip>
      ) : (
        thumbElement
      )}
    </SliderThumbContextProvider>
  )
}
