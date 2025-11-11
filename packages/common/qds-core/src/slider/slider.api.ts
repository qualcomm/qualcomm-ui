// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {sliderClasses} from "./slider.classes"
import type {
  QdsSliderApi,
  QdsSliderApiProps,
  QdsSliderControlBindings,
  QdsSliderErrorTextBindings,
  QdsSliderHiddenInputBindings,
  QdsSliderHintBindings,
  QdsSliderLabelBindings,
  QdsSliderMarkerBindings,
  QdsSliderMarkerGroupBindings,
  QdsSliderMinMaxMarkerBindings,
  QdsSliderRangeBindings,
  QdsSliderRootBindings,
  QdsSliderThumbBindings,
  QdsSliderTrackBindings,
  QdsSliderValueTextBindings,
} from "./slider.types"

export function createQdsSliderApi(
  props: QdsSliderApiProps,
  normalize: PropNormalizer,
): QdsSliderApi {
  return {
    getControlBindings(): QdsSliderControlBindings {
      return normalize.element({
        className: sliderClasses.control,
      })
    },
    getErrorTextBindings(): QdsSliderErrorTextBindings {
      return normalize.element({
        className: sliderClasses.errorText,
      })
    },
    getHiddenInputBindings(): QdsSliderHiddenInputBindings {
      return normalize.element({
        className: sliderClasses.hiddenInput,
      })
    },
    getHintBindings(): QdsSliderHintBindings {
      return normalize.element({
        className: sliderClasses.hint,
      })
    },
    getLabelBindings(): QdsSliderLabelBindings {
      return normalize.element({
        className: sliderClasses.label,
      })
    },
    getMarkerBindings(): QdsSliderMarkerBindings {
      return normalize.element({
        className: sliderClasses.marker,
      })
    },
    getMarkerGroupBindings(): QdsSliderMarkerGroupBindings {
      return normalize.element({
        className: sliderClasses.markerGroup,
      })
    },
    getMinMaxMarkerBindings(): QdsSliderMinMaxMarkerBindings {
      return normalize.element({
        className: sliderClasses.minMaxMarker,
      })
    },
    getRangeBindings(): QdsSliderRangeBindings {
      return normalize.element({
        className: sliderClasses.range,
      })
    },
    getRootBindings(): QdsSliderRootBindings {
      return normalize.element({
        className: sliderClasses.root,
        "data-size": props.size || "md",
        "data-variant": props.variant || "primary",
      })
    },
    getThumbBindings(): QdsSliderThumbBindings {
      return normalize.element({
        className: sliderClasses.thumb,
      })
    },
    getTrackBindings(): QdsSliderTrackBindings {
      return normalize.element({
        className: sliderClasses.track,
      })
    },
    getValueTextBindings(): QdsSliderValueTextBindings {
      return normalize.element({
        className: sliderClasses.valueText,
      })
    },
  }
}
