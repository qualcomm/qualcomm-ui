// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Direction, DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  IdRegistrationProps,
  JSX,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

import type {progressAnatomy} from "./progress.anatomy"

export type ProgressState = "indeterminate" | "complete" | "loading"

export type OnProgressValueChange = (value: number | undefined) => void

export interface ProgressApiProps extends DirectionProperty {
  /**
   * The initial value of the progress when it is first rendered. Use when you do
   * not need to control the state of the progress.
   */
  defaultValue?: number | undefined

  /**
   * If `true`, the progress is disabled.
   */
  disabled?: boolean

  /**
   * The element ids that are associated with the progress. These will be
   * automatically generated if omitted.
   */
  ids?: Partial<ProgressElementIds> | undefined

  /**
   * If `true`, the progress is marked as invalid.
   */
  invalid?: boolean

  /**
   * Maximum value.
   *
   * @default 100
   */
  max?: number

  /**
   * Minimum value.
   *
   * @default 0
   */
  min?: number

  /**
   * Callback fired when the value changes.
   */
  onValueChange?: OnProgressValueChange

  /**
   * The value of the progress. If omitted, the component will render as an
   * indefinite progress bar.
   */
  value?: number | undefined
}

export interface ProgressElementIds {
  errorText: string
  hint: string
  label: string
  progress: string
}

export interface ProgressScope extends ScopeWithIds<ProgressSchema> {}

export interface ProgressSchema {
  actions: ActionSchema<"setValue">
  computed: {
    /**
     * If `true`, the progress is indeterminate.
     */
    isIndeterminate: boolean

    state: ProgressState

    valuePercent: number
  }
  context: {
    value: number | undefined
  }
  events: {type: "SET_VALUE"; value: number | undefined}
  ids: ProgressElementIds
  props: RequiredBy<ProgressApiProps, "dir" | "max" | "min">
}

type PartName = AnatomyPartName<typeof progressAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"progress", P> {}

export interface ProgressRootBindings extends Part<"root"> {
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-max": number
  "data-state": ProgressState
  "data-value": number | undefined
  dir: Direction
  style: JSX.CSSProperties
}

export interface ProgressBarBindings extends Part<"bar"> {
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-max": number
  "data-state": ProgressState
  style: JSX.CSSProperties
}

export interface ProgressLabelBindings extends Part<"label"> {
  id: string
}

export interface ProgressTrackBindings extends Part<"track"> {
  "aria-describedby": string | undefined
  "aria-label": string | undefined
  "aria-labelledby": string | undefined
  "aria-valuemax": number
  "aria-valuemin": number
  "aria-valuenow": number | undefined
  "data-disabled": BooleanDataAttr
  "data-state": ProgressState
  id: string
  role: "progressbar"
}

export interface ProgressValueTextBindings extends Part<"valueText"> {
  "aria-live": "polite"
  "data-invalid": BooleanDataAttr
}

export interface ProgressErrorTextBindings extends Part<"errorText"> {
  "aria-live": "polite"
  hidden: boolean
  id: string
}

export interface ProgressHintBindings extends Part<"hint"> {
  hidden: boolean
  id: string
}

export interface ProgressRingRootBindings extends ProgressRootBindings {}

export interface ProgressRingTrackBindings extends Part<"circleTrack"> {
  "data-disabled": BooleanDataAttr
  "data-state": ProgressState
}

export interface ProgressRingBarBindings extends Part<"circleBar"> {
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-max": number
  "data-state": ProgressState
  style: JSX.CSSProperties
}

export interface ProgressRingCircleBindings
  extends Omit<ProgressTrackBindings, "data-progress-part">, Part<"circle"> {
  id: string
}

export interface ProgressApi {
  /**
   * Whether the progress bar is indeterminate
   */
  isIndeterminate: boolean

  /**
   * The maximum value of the progress bar.
   */
  max: number

  /**
   * The minimum value of the progress bar.
   */
  min: number

  /**
   * Sets the value of the progress bar.
   * @param value
   */
  setValue: (value: number | undefined) => void

  /**
   * The computed state of the progress bar, based on the `value`.
   */
  state: ProgressState

  /**
   * The current value of the progress bar.
   */
  value: number | undefined

  /**
   * The current value of the progress bar as a percentage, computed from the `min`
   * and `max` values.
   */
  valuePercent: number

  // group: bindings
  getBarBindings(): ProgressBarBindings
  getErrorTextBindings(props: IdRegistrationProps): ProgressErrorTextBindings
  getHintBindings(props: IdRegistrationProps): ProgressHintBindings
  getLabelBindings(props: IdRegistrationProps): ProgressLabelBindings
  getRingBarBindings(): ProgressRingBarBindings
  getRingCircleBindings(props: IdRegistrationProps): ProgressRingCircleBindings
  getRingRootBindings(): ProgressRingRootBindings
  getRingTrackBindings(): ProgressRingTrackBindings
  getRootBindings(): ProgressRootBindings
  getTrackBindings(props: IdRegistrationProps): ProgressTrackBindings
  getValueTextBindings(): ProgressValueTextBindings
}
