// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  CommonProperties,
  EffectSchema,
  IdRegistrationProps,
  JSX,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

export interface InputTagsApiProps extends CommonProperties {
  /**
   * Function used to focus the input field
   */
  focusInput: () => void

  /**
   * Gap between tags in pixels, used for overflow calculation.
   *
   * @default 4
   */
  gap?: number

  /**
   * Override the default element IDs.
   */
  ids?: Partial<InputTagsElementIds>

  /**
   * Whether the input field is focused
   */
  inputFocused: boolean

  /**
   * Minimum width of the input element in pixels, used for tag overflow calculation.
   *
   * @default 75
   */
  minInputWidth?: number

  /**
   * Value selection function
   * @param value
   */
  onSelectValue(value: string): void

  /**
   * Whether the parent component's dropdown is open.
   */
  open?: boolean

  /**
   * Value from the parent machine.
   */
  value: string[]
}

export interface InputTagsElementIds {
  container: string
  indicator: string
  invisibleTagsContainer: string
}

export type InputTagsElementScope = ScopeWithIds<InputTagsSchema>

export interface InputTagsSchema {
  actions: ActionSchema<
    "measureIndicator" | "measureTags" | "recalculate" | "dismissTag"
  >
  computed: {
    empty: boolean
    hasOverflow: boolean
    overflowCount: number
    visibleTags: string[]
  }
  context: {
    availableWidth: number
    indicatorWidth: number
    tagWidths: number[]
    visibleCount: number
  }
  effects: EffectSchema<"trackControlResize">
  events: {type: "REMEASURE"} | {type: "INPUT_TAG.DISMISS"; value: string}
  ids: InputTagsElementIds
  props: RequiredBy<
    InputTagsApiProps,
    | "focusInput"
    | "gap"
    | "inputFocused"
    | "minInputWidth"
    | "onSelectValue"
    | "value"
  >
  state: "idle"
}

// Binding interfaces

interface CommonBindings {
  "data-scope": "tags"
}

export interface InputTagsContainerBindings extends CommonBindings {
  "data-part": "tags-container"
  style: JSX.CSSProperties
}

export interface InputTagsTagBindings extends CommonBindings {
  "data-part": "tag"
  "data-value": string
  hidden: boolean
  id: string
  onDismiss: () => void
  style: JSX.CSSProperties
}

export interface InputTagsInvisibleTagBindings extends CommonBindings {
  "data-part": "invisible-tag"
  "data-value": string
  id: string
  style: JSX.CSSProperties
}

export interface InputTagsIndicatorBindings extends CommonBindings {
  "data-part": "tags-indicator"
  "data-state": "visible" | "hidden"
  hidden: boolean
  style: JSX.CSSProperties
}

export interface InputTagsMeasureIndicatorBindings extends CommonBindings {
  "aria-hidden": true
  "data-part": "tags-measure-indicator"
  style: JSX.CSSProperties
}

export interface InputTagsInvisibleTagContainerBindings extends CommonBindings {
  "data-part": "invisible-tag-container"
  style: JSX.CSSProperties
}

export interface InputTagsSelectionTagBindings extends CommonBindings {
  "data-part": "selection-tag"
  hidden: boolean
  onClick: JSX.MouseEventHandler
}

export interface InputTagsApi {
  /**
   * Whether the tag list is empty (no values selected).
   */
  empty: boolean

  /**
   * Whether there are overflowing tags.
   */
  hasOverflow: boolean

  /**
   * Number of tags that overflow the container.
   */
  overflowCount: number

  /**
   * All selected values from the parent machine.
   */
  values: string[]

  /**
   * The subset of values that are visible (fit in the container).
   */
  visibleTags: string[]

  // group: bindings
  getContainerBindings(props: IdRegistrationProps): InputTagsContainerBindings

  getIndicatorBindings(props: IdRegistrationProps): InputTagsIndicatorBindings

  getInvisibleTagBindings(value: string): InputTagsInvisibleTagBindings

  getInvisibleTagsContainerBindings(
    props: IdRegistrationProps,
  ): InputTagsInvisibleTagContainerBindings

  getMeasureIndicatorBindings(): InputTagsMeasureIndicatorBindings

  getSelectionTagBindings(): InputTagsSelectionTagBindings

  getTagBindings(value: string): InputTagsTagBindings
}
