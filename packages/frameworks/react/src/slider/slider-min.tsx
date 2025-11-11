// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useSliderMinMarker} from "@qualcomm-ui/react-core/slider"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSliderContext} from "./qds-slider-context"

export interface SliderMinProps extends IdProp, ElementRenderProp<"div"> {}

/**
 * The minimum value side marker. Renders a `<div>` element by default.
 */
export function SliderMin({id, ...props}: SliderMinProps): ReactElement {
  const contextProps = useSliderMinMarker({id})
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
