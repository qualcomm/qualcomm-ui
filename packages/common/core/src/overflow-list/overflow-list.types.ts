// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {Direction, DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  CommonProperties,
  EffectSchema,
  IdRegistrationProps,
  JSX,
  MachineSchema,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

import type {overflowListAnatomy} from "./overflow-list.anatomy.js"

export interface OverflowListApiProps
  extends CommonProperties, DirectionProperty {
  /**
   * The number of items in the list.
   */
  count: number

  /**
   * The initial expanded state. Use when you don't need to control the
   * expanded state.
   *
   * @default false
   */
  defaultExpanded?: boolean | undefined

  /**
   * The controlled expanded state. While expanded, every item is visible.
   */
  expanded?: boolean | undefined

  /**
   * Override the default element IDs.
   */
  ids?: Partial<OverflowListElementIds> | undefined

  /**
   * The number of rows the items may wrap onto before the rest are hidden.
   *
   * @default 1
   */
  maxRows?: number | undefined

  /**
   * Called when the expanded state changes.
   */
  onExpandedChange?: ((expanded: boolean) => void) | undefined

  /**
   * The width, in pixels, kept free at the end of the last row for content
   * that follows the items, such as an input's minimum width.
   *
   * @default 0
   */
  reservedWidth?: number | undefined
}

export interface OverflowListElementIds {
  indicator: string
  root: string
}

export interface OverflowListScope extends ScopeWithIds<OverflowListSchema> {}

export interface OverflowListFit {
  /**
   * Whether the items take up more than the allowed rows.
   */
  overflowing: boolean

  /**
   * The number of leading items that fit alongside the indicator while
   * overflowing.
   */
  visibleCount: number
}

export interface OverflowListSchema extends MachineSchema {
  actions: ActionSchema<
    "measure" | "observeLayout" | "setExpanded" | "toggleExpanded"
  >
  computed: {
    hiddenCount: number
    overflowing: boolean
  }
  context: {
    expanded: boolean
    fit: OverflowListFit
  }
  effects: EffectSchema<"trackLayout">
  events:
    | {type: "MEASURE"}
    | {type: "EXPANDED.SET"; value: boolean}
    | {type: "EXPANDED.TOGGLE"}
  ids: OverflowListElementIds
  props: RequiredBy<
    OverflowListApiProps,
    "count" | "defaultExpanded" | "dir" | "maxRows" | "reservedWidth"
  >
  refs: {
    indicatorWidth: number
    observedRoot: HTMLElement | null
    stopObserving: VoidFunction | undefined
  }
  state: "idle"
}

export interface OverflowListItemProps {
  /**
   * The item's position in the list.
   */
  index: number
}

type PartName = AnatomyPartName<typeof overflowListAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"overflow-list", P> {}

export interface OverflowListRootBindings extends Part<"root"> {
  "data-expanded": BooleanDataAttr
  "data-overflowing": BooleanDataAttr
  dir: Direction
  id: string
  style: JSX.CSSProperties
}

export interface OverflowListItemBindings extends Part<"item"> {
  "data-hidden": BooleanDataAttr
  id: string
  style: JSX.CSSProperties | undefined
}

export interface OverflowListIndicatorBindings extends Part<"indicator"> {
  "data-hidden": BooleanDataAttr
  id: string
  style: JSX.CSSProperties | undefined
}

export interface OverflowListTriggerBindings extends OverflowListIndicatorBindings {
  "aria-controls": string
  "aria-expanded": BooleanAriaAttr
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface OverflowListState {
  /**
   * Whether every item is visible.
   */
  expanded: boolean

  /**
   * The number of items hidden while collapsed. `0` while expanded.
   */
  hiddenCount: number
}

export interface OverflowListApi extends OverflowListState {
  /**
   * Whether the items take up more than the allowed rows. Stays `true` while
   * expanded, so the trigger can collapse the list again.
   */
  overflowing: boolean

  /**
   * Sets the expanded state.
   */
  setExpanded: (expanded: boolean) => void

  // group: bindings
  /**
   * A non-interactive indicator, such as a "+3" tag. Render it after the
   * items, within the root. Use either this or the trigger.
   */
  getIndicatorBindings: (
    props: IdRegistrationProps,
  ) => OverflowListIndicatorBindings
  getItemBindings: (props: OverflowListItemProps) => OverflowListItemBindings
  getRootBindings: (props: IdRegistrationProps) => OverflowListRootBindings
  /**
   * An indicator that toggles the expanded state. Render it after the items,
   * within the root. Use either this or the indicator.
   */
  getTriggerBindings: (
    props: IdRegistrationProps,
  ) => OverflowListTriggerBindings
}
