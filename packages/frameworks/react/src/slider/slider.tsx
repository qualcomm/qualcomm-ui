// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {SliderControl, type SliderControlProps} from "./slider-control"
import {SliderErrorText, type SliderErrorTextProps} from "./slider-error-text"
import type {SliderHiddenInputProps} from "./slider-hidden-input"
import {SliderHint, type SliderHintProps} from "./slider-hint"
import {SliderLabel, type SliderLabelProps} from "./slider-label"
import type {SliderMarkerProps} from "./slider-marker"
import type {SliderMarkerGroupProps} from "./slider-marker-group"
import {SliderMarkers} from "./slider-markers"
import {SliderMax, type SliderMaxProps} from "./slider-max"
import {SliderMin, type SliderMinProps} from "./slider-min"
import {SliderRange, type SliderRangeProps} from "./slider-range"
import {SliderRoot, type SliderRootProps} from "./slider-root"
import type {SliderThumbProps} from "./slider-thumb"
import {SliderThumbs} from "./slider-thumbs"
import {SliderTrack, type SliderTrackProps} from "./slider-track"
import {SliderValueText, type SliderValueTextProps} from "./slider-value-text"

export interface SliderProps extends SliderRootProps {
  /**
   * Props applied to the control element.
   *
   * @inheritDoc
   */
  controlProps?: SliderControlProps

  /**
   * How to display range values: a separator string or a function that receives the
   * value array and returns a React node.
   *
   * @default '—'
   */
  display?: string | ((value: number[]) => ReactNode)

  /**
   * The error message to display when the slider value is invalid.
   */
  errorText?: ReactNode

  /**
   * Props applied to the error text element.
   *
   * @inheritDoc
   */
  errorTextProps?: SliderErrorTextProps

  /**
   * Props applied to all hidden input elements.
   *
   * @inheritDoc
   */
  hiddenInputProps?: SliderHiddenInputProps

  /**
   * Optional hint text to display below the slider.
   */
  hint?: ReactNode

  /**
   * Props applied to the hint element.
   *
   * @inheritDoc
   */
  hintProps?: SliderHintProps

  /**
   * The label text for the slider.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   *
   * @inheritDoc
   */
  labelProps?: SliderLabelProps

  /**
   * Props applied to the marker group element.
   *
   * @inheritDoc
   */
  markerGroupProps?: SliderMarkerGroupProps

  /**
   * Props applied to all marker elements.
   *
   * @inheritDoc
   */
  markerProps?: Omit<SliderMarkerProps, "value">

  /**
   * The list of marks to display along the slider track.
   */
  marks?: number[]

  /**
   * Props applied to the max element.
   *
   * @inheritDoc
   */
  maxProps?: SliderMaxProps

  /**
   * Props applied to the min element.
   *
   * @inheritDoc
   */
  minProps?: SliderMinProps

  /**
   * Props applied to the range element.
   *
   * @inheritDoc
   */
  rangeProps?: SliderRangeProps

  /**
   * Whether to display markers on the sides of the slider.
   */
  sideMarkers?: boolean

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

  /**
   * Props applied to the track element.
   *
   * @inheritDoc
   */
  trackProps?: SliderTrackProps

  /**
   * Props applied to the value text element.
   *
   * @inheritDoc
   */
  valueTextProps?: SliderValueTextProps
}

export function Slider({
  controlProps,
  display,
  errorText,
  errorTextProps,
  hiddenInputProps,
  hint,
  hintProps,
  label,
  labelProps,
  markerGroupProps,
  markerProps,
  marks,
  maxProps,
  minProps,
  rangeProps,
  sideMarkers,
  thumbProps,
  tooltip,
  trackProps,
  valueTextProps,
  ...props
}: SliderProps): ReactElement {
  const labelContent = label || labelProps?.children
  const hintContent = hint || hintProps?.children
  const errorTextContent = errorText || errorTextProps?.children

  return (
    <SliderRoot {...props}>
      {labelContent ? (
        <SliderLabel {...labelProps}>{labelContent}</SliderLabel>
      ) : null}
      {!tooltip ? (
        <SliderValueText display={display} {...valueTextProps} />
      ) : null}
      {sideMarkers ? <SliderMin {...minProps} /> : null}
      <SliderControl {...controlProps}>
        <SliderTrack {...trackProps}>
          <SliderRange {...rangeProps} />
        </SliderTrack>
        <SliderThumbs
          hiddenInputProps={hiddenInputProps}
          thumbProps={thumbProps}
          tooltip={tooltip}
        />
      </SliderControl>
      {sideMarkers ? <SliderMax {...maxProps} /> : null}
      {hintContent ? (
        <SliderHint {...hintProps}>{hintContent}</SliderHint>
      ) : null}
      {errorTextContent ? (
        <SliderErrorText {...errorTextProps}>
          {errorTextContent}
        </SliderErrorText>
      ) : null}
      {!sideMarkers ? (
        <SliderMarkers
          {...(Array.isArray(marks) ? {marks} : {})}
          markerGroupProps={markerGroupProps}
          markerProps={markerProps}
        />
      ) : null}
    </SliderRoot>
  )
}
