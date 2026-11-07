// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {sliderClasses} from "@qualcomm-ui/qds-core/slider"

export type QdsSliderSize = "sm" | "md"

/** @deprecated use "brand" */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type QdsSliderEmphasis__deprecated = "primary"

export type QdsSliderEmphasis =
  | "brand"
  | "neutral"
  | QdsSliderEmphasis__deprecated

/**
 * @deprecated use {@link QdsSliderEmphasis} instead
 */
export type QdsSliderVariant = QdsSliderEmphasis

export interface QdsSliderApiProps {
  /**
   * Governs the color of the slider.
   *
   * @default 'brand'
   * @since 2.0.0
   */
  emphasis?: QdsSliderEmphasis

  /**
   * The size of the slider.
   */
  size?: QdsSliderSize

  /**
   * @deprecated use {@link emphasis} instead
   */
  variant?: QdsSliderVariant
}

type SliderClasses = typeof sliderClasses

export interface QdsSliderControlBindings {
  className: SliderClasses["control"]
}
export interface QdsSliderThumbIndicatorBindings {
  className: SliderClasses["thumbIndicator"]
}
export interface QdsSliderErrorTextBindings {
  className: SliderClasses["errorText"]
}
export interface QdsSliderHiddenInputBindings {
  className: SliderClasses["hiddenInput"]
}
export interface QdsSliderHintBindings {
  className: SliderClasses["hint"]
}
export interface QdsSliderLabelBindings {
  className: SliderClasses["label"]
}
export interface QdsSliderMarkerBindings {
  className: SliderClasses["marker"]
}
export interface QdsSliderMarkerGroupBindings {
  className: SliderClasses["markerGroup"]
}
export interface QdsSliderMinMaxMarkerBindings {
  className: SliderClasses["minMaxMarker"]
}
export interface QdsSliderRangeBindings {
  className: SliderClasses["range"]
}
export interface QdsSliderRootBindings {
  className: SliderClasses["root"]
  "data-emphasis": QdsSliderEmphasis
  "data-size": QdsSliderSize
}
export interface QdsSliderThumbBindings {
  className: SliderClasses["thumb"]
}
export interface QdsSliderTrackBindings {
  className: SliderClasses["track"]
}
export interface QdsSliderValueTextBindings {
  className: SliderClasses["valueText"]
}

export interface QdsSliderApi {
  getControlBindings(): QdsSliderControlBindings
  getErrorTextBindings(): QdsSliderErrorTextBindings
  getHiddenInputBindings(): QdsSliderHiddenInputBindings
  getHintBindings(): QdsSliderHintBindings
  getLabelBindings(): QdsSliderLabelBindings
  getMarkerBindings(): QdsSliderMarkerBindings
  getMarkerGroupBindings(): QdsSliderMarkerGroupBindings
  getMinMaxMarkerBindings(): QdsSliderMinMaxMarkerBindings
  getRangeBindings(): QdsSliderRangeBindings
  getRootBindings(): QdsSliderRootBindings
  getThumbBindings(): QdsSliderThumbBindings
  getThumbIndicatorBindings(): QdsSliderThumbIndicatorBindings
  getTrackBindings(): QdsSliderTrackBindings
  getValueTextBindings(): QdsSliderValueTextBindings
}
