// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useSliderMaxMarker} from "@qualcomm-ui/react-core/slider"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSliderContext} from "./qds-slider-context"

export interface SliderMaxProps extends IdProp, ElementRenderProp<"div"> {}

/**
 * The maximum value side marker. Renders a `<div>` element by default.
 */
export function SliderMax({id, ...props}: SliderMaxProps): ReactElement {
  const contextProps = useSliderMaxMarker({id})
  const qdsContext = useQdsSliderContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getMinMaxMarkerBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {contextProps["data-value"]}
    </PolymorphicElement>
  )
}
