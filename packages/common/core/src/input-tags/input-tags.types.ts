// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  CommonProperties,
  EffectSchema,
  IdRegistrationProps,
  JSX,
  PropNormalizer,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

export interface TagsProps extends CommonProperties {
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
    values: string[]
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
    TagsProps,
    "gap" | "minInputWidth" | "onSelectValue" | "value"
  >
  state: "idle"
}

// Binding interfaces

export interface InputTagsContainerBindings {
  "data-part": "tags-container"
  "data-scope": "tags"
  style: JSX.CSSProperties
}

export interface InputTagsTagBindings {
  "data-part": "tag"
  "data-scope": "tags"
  "data-value": string
  hidden: boolean
  id: string
  onDismiss: () => void
  style: JSX.CSSProperties
}

export interface InputTagsInvisibleTagBindings {
  "data-part": "invisible-tag"
  "data-scope": "tags"
  "data-value": string
  id: string
  style: JSX.CSSProperties
}

export interface InputTagsIndicatorBindings {
  "data-part": "tags-indicator"
  "data-scope": "tags"
  "data-state": "visible" | "hidden"
  hidden: boolean
  style: JSX.CSSProperties
}

export interface InputTagsMeasureIndicatorBindings {
  "aria-hidden": true
  "data-part": "tags-measure-indicator"
  "data-scope": "tags"
  style: JSX.CSSProperties
}

export interface InputTagsInvisibleTagContainerBindings {
  "data-part": "invisible-tag-container"
  "data-scope": "tags"
  style: JSX.CSSProperties
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

  getTagBindings(value: string): InputTagsTagBindings
}

export type CreateTagsApi = (
  machine: unknown,
  normalize: PropNormalizer,
) => InputTagsApi
