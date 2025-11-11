// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useSliderValueText} from "@qualcomm-ui/react-core/slider"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSliderContext} from "./qds-slider-context"

export interface SliderValueTextProps
  extends IdProp,
    ElementRenderProp<"output"> {
  /**
   * How to display range values: a separator string or a function that receives the
   * value array and returns a React node.
   *
   * @default '-'
   */
  display?: string | ((value: number[]) => ReactNode)
}

/**
 * The slider current value as text. Renders a `<output>` element by default.
 */
export function SliderValueText({
  display,
  id,
  ...props
}: SliderValueTextProps): ReactElement {
  const contextProps = useSliderValueText({id})
  const qdsContext = useQdsSliderContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getValueTextBindings(),
    props,
  )

  const valueText =
    typeof display === "function"
      ? display(contextProps.value)
      : typeof display === "string"
        ? contextProps.value.join(display)
        : contextProps.value.join(" - ")

  return (
    <PolymorphicElement as="output" {...mergedProps}>
      {valueText}
    </PolymorphicElement>
  )
}
