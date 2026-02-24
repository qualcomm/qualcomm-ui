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

/**
 * Minimal interface for reading parent machine state.
 * Both select and combobox machines satisfy this shape at runtime.
 */
export interface TagsParentMachine {
  context: {
    get(key: "value"): string[]
  }
  selectValue: (value: string) => void
}

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
  ids?: Partial<TagElementIds>

  /**
   * Minimum width of the input element in pixels, used for tag overflow calculation.
   *
   * @default 75
   */
  minInputWidth?: number

  /**
   * The parent machine (select or combobox) that provides the necessary context for
   * this machine to function.
   */
  parent: TagsParentMachine
}

export interface TagElementIds {
  container: string
  indicator: string
  invisibleTagsContainer: string
}

export type TagElementScope = ScopeWithIds<TagsSchema>

export interface TagsSchema {
  actions: ActionSchema<"measureIndicator" | "measureTags" | "recalculate">
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
  events: {type: "REMEASURE"}
  ids: TagElementIds
  props: RequiredBy<TagsProps, "gap" | "minInputWidth" | "parent">
  state: "idle"
}

// Binding interfaces

export interface TagsContainerBindings {
  "data-part": "tags-container"
  "data-scope": "tags"
  style: JSX.CSSProperties
}

export interface TagsTagBindings {
  "data-part": "tag"
  "data-scope": "tags"
  "data-value": string
  hidden: boolean
  id: string
  onClick: JSX.MouseEventHandler
  style: JSX.CSSProperties
}

export interface TagsInvisibleTagBindings {
  "data-part": "invisible-tag"
  "data-scope": "tags"
  "data-value": string
  id: string
  style: JSX.CSSProperties
}

export interface TagsIndicatorBindings {
  "data-part": "tags-indicator"
  "data-scope": "tags"
  "data-state": "visible" | "hidden"
  hidden: boolean
  style: JSX.CSSProperties
}

export interface TagsMeasureIndicatorBindings {
  "aria-hidden": true
  "data-part": "tags-measure-indicator"
  "data-scope": "tags"
  style: JSX.CSSProperties
}

export interface TagsInvisibleTagContainerBindings {
  "data-part": "invisible-tag-container"
  "data-scope": "tags"
  style: JSX.CSSProperties
}

export interface TagsApi {
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
  getContainerBindings(props: IdRegistrationProps): TagsContainerBindings

  getIndicatorBindings(props: IdRegistrationProps): TagsIndicatorBindings

  getInvisibleTagBindings(value: string): TagsInvisibleTagBindings

  getInvisibleTagsContainerBindings(
    props: IdRegistrationProps,
  ): TagsInvisibleTagContainerBindings

  getMeasureIndicatorBindings(): TagsMeasureIndicatorBindings

  getTagBindings(value: string): TagsTagBindings
}

export type CreateTagsApi = (
  machine: unknown,
  normalize: PropNormalizer,
) => TagsApi
