// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {type SliderApiProps, splitSliderProps} from "@qualcomm-ui/core/slider"
import {
  createQdsSliderApi,
  type QdsSliderApiProps,
} from "@qualcomm-ui/qds-core/slider"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {SliderContextProvider, useSlider} from "@qualcomm-ui/react-core/slider"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsSliderContextProvider} from "./qds-slider-context"

export interface SliderRootProps
  extends SliderApiProps,
    QdsSliderApiProps,
    Omit<
      ElementRenderProp<"div">,
      "dir" | "defaultValue" | "aria-label" | "aria-labelledby"
    > {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The main component that wraps the slider subcomponents. Renders a `<div>` element
 * by default.
 */
export function SliderRoot({
  children,
  id,
  size,
  variant,
  ...props
}: SliderRootProps): ReactElement {
  const [sliderProps, localProps] = splitSliderProps(props)
  const context = useSlider(sliderProps)
  const qdsContext = useMemo(
    () => createQdsSliderApi({size, variant}, normalizeProps),
    [size, variant],
  )
  const mergedProps = mergeProps(
    context.getRootBindings({id: useControlledId(id)}),
    qdsContext.getRootBindings(),
    localProps,
  )

  return (
    <QdsSliderContextProvider value={qdsContext}>
      <SliderContextProvider value={context}>
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </SliderContextProvider>
    </QdsSliderContextProvider>
  )
}
