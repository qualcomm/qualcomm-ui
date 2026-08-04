import {SliderControl, type SliderControlProps} from "./slider-control.js"
import {
  SliderErrorText,
  type SliderErrorTextProps,
} from "./slider-error-text.js"
import {
  SliderHiddenInput,
  type SliderHiddenInputProps,
} from "./slider-hidden-input.js"
import {SliderHint, type SliderHintProps} from "./slider-hint.js"
import {SliderLabel, type SliderLabelProps} from "./slider-label.js"
import {
  SliderMarkerGroup,
  type SliderMarkerGroupProps,
} from "./slider-marker-group.js"
import {SliderMarker, type SliderMarkerProps} from "./slider-marker.js"
import {SliderMarkers} from "./slider-markers.js"
import {SliderMax, type SliderMaxProps} from "./slider-max.js"
import {SliderMin, type SliderMinProps} from "./slider-min.js"
import {SliderRange, type SliderRangeProps} from "./slider-range.js"
import {SliderRoot, type SliderRootProps} from "./slider-root.js"
import {
  SliderThumbIndicator,
  type SliderThumbIndicatorProps,
} from "./slider-thumb-indicator.js"
import {SliderThumb, type SliderThumbProps} from "./slider-thumb.js"
import {SliderThumbs} from "./slider-thumbs.js"
import {SliderTrack, type SliderTrackProps} from "./slider-track.js"
import {
  SliderValueText,
  type SliderValueTextProps,
} from "./slider-value-text.js"
import {Slider as SimpleSlider} from "./slider.js"

export type {
  SliderRootProps,
  SliderLabelProps,
  SliderValueTextProps,
  SliderHiddenInputProps,
  SliderControlProps,
  SliderThumbIndicatorProps,
  SliderTrackProps,
  SliderRangeProps,
  SliderThumbProps,
  SliderMarkerProps,
  SliderMarkerGroupProps,
  SliderHintProps,
  SliderErrorTextProps,
  SliderMinProps,
  SliderMaxProps,
}

type SliderComponent = typeof SimpleSlider & {
  Control: typeof SliderControl
  ErrorText: typeof SliderErrorText
  HiddenInput: typeof SliderHiddenInput
  Hint: typeof SliderHint
  Label: typeof SliderLabel
  Marker: typeof SliderMarker
  MarkerGroup: typeof SliderMarkerGroup
  Markers: typeof SliderMarkers
  Max: typeof SliderMax
  Min: typeof SliderMin
  Range: typeof SliderRange
  Root: typeof SliderRoot
  Thumb: typeof SliderThumb
  ThumbIndicator: typeof SliderThumbIndicator
  Thumbs: typeof SliderThumbs
  Track: typeof SliderTrack
  ValueText: typeof SliderValueText
}

export const Slider = SimpleSlider as SliderComponent

Slider.Control = SliderControl
Slider.ThumbIndicator = SliderThumbIndicator
Slider.ErrorText = SliderErrorText
Slider.HiddenInput = SliderHiddenInput
Slider.Hint = SliderHint
Slider.Label = SliderLabel
Slider.Marker = SliderMarker
Slider.MarkerGroup = SliderMarkerGroup
Slider.Markers = SliderMarkers
Slider.Max = SliderMax
Slider.Min = SliderMin
Slider.Range = SliderRange
Slider.Root = SliderRoot
Slider.Thumb = SliderThumb
Slider.Thumbs = SliderThumbs
Slider.Track = SliderTrack
Slider.ValueText = SliderValueText
