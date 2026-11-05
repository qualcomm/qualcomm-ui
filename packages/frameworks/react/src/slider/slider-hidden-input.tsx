// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement} from "react"

import {useSliderHiddenInput} from "@qualcomm-ui/react-core/slider"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSliderContext} from "./qds-slider-context.js"

export interface SliderHiddenInputProps
  extends IdProp, ComponentPropsWithRef<"input"> {}

/**
 * The hidden input element associated with the thumb. Renders an `<input>` element
 * by default.
 */
export function SliderHiddenInput({
  id,
  ...props
}: SliderHiddenInputProps): ReactElement {
  const contextProps = useSliderHiddenInput({id})
  const qdsContext = useQdsSliderContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsContext.getHiddenInputBindings(),
    props,
  )

  return <input {...mergedProps} />
}
