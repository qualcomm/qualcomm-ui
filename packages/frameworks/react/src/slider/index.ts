import {Slider as SimpleSlider} from "./slider"
import {SliderControl, type SliderControlProps} from "./slider-control"
import {SliderErrorText, type SliderErrorTextProps} from "./slider-error-text"
import {
  SliderHiddenInput,
  type SliderHiddenInputProps,
} from "./slider-hidden-input"
import {SliderHint, type SliderHintProps} from "./slider-hint"
import {SliderLabel, type SliderLabelProps} from "./slider-label"
import {SliderMarker, type SliderMarkerProps} from "./slider-marker"
import {
  SliderMarkerGroup,
  type SliderMarkerGroupProps,
} from "./slider-marker-group"
import {SliderMarkers} from "./slider-markers"
import {SliderMax, type SliderMaxProps} from "./slider-max"
import {SliderMin, type SliderMinProps} from "./slider-min"
import {SliderRange, type SliderRangeProps} from "./slider-range"
import {SliderRoot, type SliderRootProps} from "./slider-root"
import {SliderThumb, type SliderThumbProps} from "./slider-thumb"
import {
  SliderThumbIndicator,
  type SliderThumbIndicatorProps,
} from "./slider-thumb-indicator"
import {SliderThumbs} from "./slider-thumbs"
import {SliderTrack, type SliderTrackProps} from "./slider-track"
import {SliderValueText, type SliderValueTextProps} from "./slider-value-text"

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
