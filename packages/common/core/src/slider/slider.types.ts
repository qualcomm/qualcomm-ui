// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Point} from "@qualcomm-ui/dom/rect-utils"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  CommonProperties,
  EffectSchema,
  GuardSchema,
  IdRegistrationProps,
  JSX,
} from "@qualcomm-ui/utils/machine"

export interface SliderElementIds {
  control: string
  errorText: string
  hiddenInput: string[]
  hint: string
  label: string
  marker: string[]
  markerGroup: string
  maxMarker: string
  minMarker: string
  range: string
  root: string
  thumb: string[]
  thumbIndicator: string[]
  track: string
  valueText: string
}

export interface ValueChangeDetails {
  value: number[]
}

export interface FocusChangeDetails {
  focusedIndex: number
  value: number[]
}

export interface ValueTextDetails {
  index: number
  value: number
}

export interface SliderApiProps extends DirectionProperty, CommonProperties {
  /**
   * The aria-label of each slider thumb. Useful for providing an accessible name to
   * the slider
   */
  "aria-label"?: string[] | string | undefined
  /**
   * The `id` of the elements that labels each slider thumb. Useful for providing an
   * accessible name to the slider
   */
  "aria-labelledby"?: string[] | string | undefined
  /**
   * The initial value of the slider when rendered.
   * Use when you don't need to control the value of the slider.
   */
  defaultValue?: number[] | undefined
  /**
   * Whether the slider is disabled
   */
  disabled?: boolean | undefined
  /**
   * The form associated to the underlying input element.
   */
  form?: string | undefined
  /**
   * Function that returns a human readable value for the slider thumb
   */
  getAriaValueText?(details: ValueTextDetails): string
  /**
   * Whether the slider is invalid
   */
  invalid?: boolean | undefined
  /**
   * The maximum value of the slider
   * @default 100
   */
  max?: number | undefined
  /**
   * The minimum value of the slider
   * @default 0
   */
  min?: number | undefined
  /**
   * The minimum permitted steps between multiple thumbs.
   *
   * `minStepsBetweenThumbs` * `step` should reflect the gap between the thumbs.
   *
   * - `step: 1` and `minStepsBetweenThumbs: 10` => gap is `10`
   * - `step: 10` and `minStepsBetweenThumbs: 2` => gap is `20`
   *
   * @default 0
   */
  minStepsBetweenThumbs?: number | undefined
  /**
   * The input name(s) for the slider thumbs.
   * - For a single thumb, pass a string.
   * - For two thumbs (range slider), pass the two names in an array or a single
   *   name to be prefixed with its index (e.g., "slider" → "slider0", "slider1")
   */
  name?: string[] | string | undefined
  /**
   * Function invoked when the slider's focused index changes
   */
  onFocusChange?(details: FocusChangeDetails): void
  /**
   * Function invoked when the value of the slider changes
   */
  onValueChange?(details: ValueChangeDetails): void
  /**
   * Function invoked when the slider value change is done
   */
  onValueChangeEnd?(details: ValueChangeDetails): void
  /**
   * The orientation of the slider
   * @default "horizontal"
   */
  orientation?: "vertical" | "horizontal" | undefined
  /**
   * The origin of the slider range. The track is filled from the origin
   * to the thumb for single values.
   * - "start": Useful when the value represents an absolute value
   * - "center": Useful when the value represents an offset (relative)
   * - "end": Useful when the value represents an offset from the end
   *
   * @default "start"
   */
  origin?: "start" | "center" | "end" | undefined
  /**
   * Whether the slider is read-only
   */
  readOnly?: boolean | undefined
  /**
   * The step value of the slider
   * @default 1
   */
  step?: number | undefined
  /**
   * The alignment of the slider thumb relative to the track
   * - `center`: the thumb will extend beyond the bounds of the slider track.
   * - `contain`: the thumb will be contained within the bounds of the track.
   *
   * @default "contain"
   */
  thumbAlignment?: "contain" | "center" | undefined
  /**
   * The slider thumbs dimensions
   */
  thumbSize?: {height: number; width: number} | undefined
  /**
   * The controlled value of the slider
   */
  value?: number[] | undefined
}

export interface Size {
  height: number
  width: number
}

type Actions = ActionSchema<
  | "clearFocusedIndex"
  | "clearThumbDragOffset"
  | "decrementThumbAtIndex"
  | "dispatchChangeEvent"
  | "focusActiveThumb"
  | "incrementThumbAtIndex"
  | "invokeOnChangeEnd"
  | "setClosestThumbIndex"
  | "setFocusedIndex"
  | "setFocusedThumbToMax"
  | "setFocusedThumbToMin"
  | "setPointerValue"
  | "setThumbDragOffset"
  | "setValue"
  | "setValueAtIndex"
  | "syncInputElements"
>

type Effects = EffectSchema<
  "trackFormControlState" | "trackPointerMove" | "trackThumbSize"
>

type ArrowKeys =
  | "ArrowDown"
  | "ArrowUp"
  | "ArrowLeft"
  | "ArrowRight"
  | "PageDown"
  | "PageUp"

type Events =
  | {index?: number; type: "SET_VALUE"; value: number | number[]}
  | {index?: number; type: "INCREMENT"}
  | {index?: number; type: "DECREMENT"}
  | {point: Point; type: "POINTER_DOWN"}
  | {type: "POINTER_UP"}
  | {point: Point; type: "POINTER_MOVE"}
  | {index: number; type: "FOCUS"}
  | {index: number; offset?: {x: number; y: number}; type: "THUMB_POINTER_DOWN"}
  | {index?: number; src: ArrowKeys; step: number; type: "ARROW_DEC"}
  | {index?: number; src: ArrowKeys; step: number; type: "ARROW_INC"}
  | {type: "HOME"}
  | {type: "END"}
  | {type: "BLUR"}

type Guards = GuardSchema<"hasIndex">

interface Context {
  /**
   * @internal
   * Whether the slider fieldset is disabled
   */
  fieldsetDisabled: boolean
  /**
   * The active index of the range slider. This represents
   * the currently dragged/focused thumb.
   */
  focusedIndex: number
  /**
   * The size of the slider thumbs
   */
  thumbSize: Size | null
  /**
   * The value of the range slider
   */
  value: number[]
}

interface Computed {
  hasMeasuredThumbSize: boolean
  isDisabled: boolean
  isHorizontal: boolean
  isInteractive: boolean
  isRtl: boolean
  isVertical: boolean
  valuePercent: number[]
}

interface Refs {
  thumbDragOffset: {x: number; y: number} | null
}

export interface SliderSchema {
  actions: Actions
  computed: Computed
  context: Context
  effects: Effects
  events: Events
  guards: Guards
  ids: SliderElementIds
  props: RequiredBy<
    SliderApiProps,
    | "defaultValue"
    | "dir"
    | "max"
    | "min"
    | "minStepsBetweenThumbs"
    | "orientation"
    | "origin"
    | "step"
    | "thumbAlignment"
  >
  refs: Refs
}

export interface ThumbProps {
  /**
   * The slider thumb's index.
   */
  index: number
  /**
   * The name associated with the slider thumb's input (when used in a form).
   */
  name?: string
}

type Orientation = "vertical" | "horizontal"

interface CommonBindings extends DirectionProperty {
  "data-scope": "slider"
}

export interface SliderControlBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-dragging": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-orientation": Orientation | undefined
  "data-part": "control"
  id: string
  max: number
  min: number
  onPointerDown: JSX.PointerEventHandler
  style: JSX.CSSProperties
}

export interface SliderThumbIndicatorBindings extends CommonBindings {
  "data-orientation": Orientation | undefined
  "data-part": "thumb-indicator"
  role: "presentation"
  style: JSX.CSSProperties
}

export interface SliderErrorTextBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-dragging": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-orientation": Orientation | undefined
  "data-part": "error-text"
  hidden: boolean
  id: string
}

export interface SliderHiddenInputBindings extends CommonBindings {
  defaultValue: number
  form: string | undefined
  hidden: boolean
  id: string
  name: string | undefined
  type: "text"
}

export interface SliderHintBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-dragging": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-orientation": Orientation | undefined
  "data-part": "hint"
  hidden: boolean
  id: string
}

export interface SliderLabelBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-dragging": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-orientation": Orientation | undefined
  "data-part": "label"
  htmlFor: string | undefined
  id: string
  onClick: JSX.MouseEventHandler
  style: JSX.CSSProperties
}

export interface SliderMarkerBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-orientation": Orientation | undefined
  "data-part": "marker"
  "data-state": "over-value" | "under-value" | "at-value"
  "data-value": number
  id: string
  role: "presentation"
  style: JSX.CSSProperties
}

export interface SliderMarkerGroupBindings extends CommonBindings {
  "aria-hidden": true
  "data-orientation": Orientation | undefined
  "data-part": "marker-group"
  role: "presentation"
  style: JSX.CSSProperties
}

export interface SliderRangeBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-dragging": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-orientation": Orientation | undefined
  "data-part": "range"
  id: string
  style: JSX.CSSProperties
}

export interface SliderRootBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-dragging": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-orientation": Orientation | undefined
  "data-part": "root"
  id: string
  style: JSX.CSSProperties
}

export interface SliderThumbBindings extends CommonBindings {
  "aria-describedby": string | undefined
  "aria-disabled": BooleanAriaAttr
  "aria-label": string | undefined
  "aria-labelledby": string | undefined
  "aria-orientation": Orientation | undefined
  "aria-valuemax": number
  "aria-valuemin": number
  "aria-valuenow": number
  "aria-valuetext": string | undefined
  "data-disabled": BooleanDataAttr
  "data-dragging": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-index": number
  "data-name": string | undefined
  "data-orientation": Orientation | undefined
  "data-part": "thumb"
  draggable: boolean
  id: string
  onBlur: JSX.FocusEventHandler
  onFocus: JSX.FocusEventHandler
  onKeyDown: JSX.KeyboardEventHandler<HTMLElement>
  onPointerDown: JSX.PointerEventHandler
  role: "slider"
  style: JSX.CSSProperties
  tabIndex: number | undefined
}

export interface SliderTrackBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-dragging": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-orientation": Orientation | undefined
  "data-part": "track"
  id: string
  style: JSX.CSSProperties
}

export interface SliderValueTextBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-orientation": Orientation | undefined
  "data-part": "value-text"
  id: string
  value: number[]
}

export interface SliderMinMarkerBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-orientation": Orientation | undefined
  "data-part": "min"
  "data-value": number
  id: string
  role: "presentation"
}

export interface SliderMaxMarkerBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-orientation": Orientation | undefined
  "data-part": "max"
  "data-value": number
  id: string
  role: "presentation"
}

export interface SliderApi {
  decrement(index: number): void
  dragging: boolean
  focus(): void
  focused: boolean
  focusedIndex: number
  getDefaultMarks: (count?: number) => number[]
  getPercentValue: (percent: number) => number
  getThumbMax(index: number): number
  getThumbMin(index: number): number
  getThumbPercent(index: number): number
  getThumbValue(index: number): number
  getValuePercent: (value: number) => number
  increment(index: number): void
  max: number
  min: number
  setThumbPercent(index: number, percent: number): void
  setThumbValue(index: number, value: number): void
  setValue(value: number[]): void
  value: number[]
  // group: bindings
  getControlBindings(props: IdRegistrationProps): SliderControlBindings
  getErrorTextBindings(props: IdRegistrationProps): SliderErrorTextBindings
  getHiddenInputBindings(
    props: ThumbProps & IdRegistrationProps,
  ): SliderHiddenInputBindings
  getHintBindings(props: IdRegistrationProps): SliderHintBindings
  getLabelBindings(props: IdRegistrationProps): SliderLabelBindings
  getMarkerBindings(
    props: {value: number} & IdRegistrationProps,
  ): SliderMarkerBindings
  getMarkerGroupBindings(props: IdRegistrationProps): SliderMarkerGroupBindings
  getMaxMarkerBindings(props: IdRegistrationProps): SliderMaxMarkerBindings
  getMinMarkerBindings(props: IdRegistrationProps): SliderMinMarkerBindings
  getRangeBindings(props: IdRegistrationProps): SliderRangeBindings
  getRootBindings(props: IdRegistrationProps): SliderRootBindings
  getThumbBindings(props: ThumbProps & IdRegistrationProps): SliderThumbBindings
  getThumbIndicatorBindings(
    props: {index: number} & IdRegistrationProps,
  ): SliderThumbIndicatorBindings
  getTrackBindings(props: IdRegistrationProps): SliderTrackBindings
  getValueTextBindings(props: IdRegistrationProps): SliderValueTextBindings
}
