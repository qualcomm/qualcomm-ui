// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useSliderContext} from "@qualcomm-ui/react-core/slider"

import {
  SliderHiddenInput,
  type SliderHiddenInputProps,
} from "./slider-hidden-input"
import {SliderThumb, type SliderThumbProps} from "./slider-thumb"

export interface SliderThumbsProps {
  /**
   * Props applied to all hidden input elements.
   *
   * @inheritDoc
   */
  hiddenInputProps?: SliderHiddenInputProps

  /**
   * Props applied to all thumb elements.
   *
   * @inheritDoc
   */
  thumbProps?: Omit<SliderThumbProps, "index" | "tooltip">

  /**
   * Whether to display the thumb value as a tooltip.
   */
  tooltip?: boolean
}

/**
 * A shortcut element for the draggable handle(s) and their associated hidden
 * input(s).
 */
export function SliderThumbs({
  hiddenInputProps,
  thumbProps,
  tooltip,
}: SliderThumbsProps): ReactElement {
  const context = useSliderContext()
  return (
    <>
      {context.value.map((_, idx) => (
        <SliderThumb key={idx} index={idx} tooltip={tooltip} {...thumbProps}>
          <SliderHiddenInput {...hiddenInputProps} />
        </SliderThumb>
      ))}
    </>
  )
}
