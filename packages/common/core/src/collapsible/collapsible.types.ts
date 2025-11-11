// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanAriaAttr, BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  BindableIds,
  CommonProperties,
  EffectSchema,
  GuardSchema,
  IdRegistrationProps,
  JSX,
  MachineSchema,
  Scope,
} from "@qualcomm-ui/utils/machine"

export interface CollapsibleApiProps
  extends CommonProperties,
    DirectionProperty {
  /**
   * The initial open state of the collapsible when rendered.
   * Use when you don't need to control the open state of the collapsible.
   *
   * @default false
   */
  defaultOpen?: boolean | undefined

  /**
   * Whether the collapsible is disabled.
   */
  disabled?: boolean | undefined

  /**
   * The callback invoked when the exit animation completes.
   */
  onExitComplete?: (() => void) | undefined

  /**
   * Function invoked when the collapsible opens or closes
   */
  onOpenChange?: (
    /**
     * The next value.
     */
    open: boolean,
  ) => void

  /**
   * The controlled open state of the collapsible
   */
  open?: boolean | undefined
}

export type CollapsibleState = "open" | "closed" | "closing"

export interface CollapsibleElementIds {
  content: string
  trigger: string
}

export interface CollapsibleScope extends Scope {
  ids: BindableIds<CollapsibleSchema>
}

export interface CollapsibleSchema extends MachineSchema {
  actions: ActionSchema<
    | "setInitial"
    | "clearInitial"
    | "cleanupNode"
    | "measureSize"
    | "computeSize"
    | "invokeOnOpen"
    | "invokeOnClose"
    | "invokeOnExitComplete"
    | "syncSsr"
    | "toggleVisibility"
  >
  context: {
    initial: boolean
    size: {height: number; width: number}
    ssr: boolean
  }
  effects: EffectSchema<"trackEnterAnimation" | "trackExitAnimation">
  events:
    | {type: "controlled.open"}
    | {type: "controlled.close"}
    | {type: "open"}
    | {type: "close"}
    | {type: "size.measure"}
    | {type: "animation.end"}
  guards: GuardSchema<"isOpenControlled">
  ids: CollapsibleElementIds
  props: RequiredBy<CollapsibleApiProps, "dir"> & {forceMeasureOnOpen?: boolean}
  refs: {
    cleanup: (() => void) | undefined
    stylesRef: any
  }
  state: CollapsibleState
}

export interface CollapsibleCommonBindings extends DirectionProperty {
  "data-scope": "collapsible"
}

export interface CollapsibleRootBindings extends CollapsibleCommonBindings {
  "data-part": "root"
  "data-state": CollapsibleState
}

export interface CollapsibleContentBindings extends CollapsibleCommonBindings {
  "data-collapsible": BooleanDataAttr
  "data-disabled": BooleanDataAttr
  "data-part": "content"
  "data-ssr": BooleanDataAttr
  "data-state": CollapsibleState | undefined
  hidden: boolean
  id: string
  style: JSX.CSSProperties
}

export interface CollapsibleTriggerBindings extends CollapsibleCommonBindings {
  "aria-controls": string
  "aria-expanded": BooleanAriaAttr
  "data-disabled": BooleanDataAttr
  "data-part": "trigger"
  "data-state": CollapsibleState
  id: string
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface CollapsibleApi {
  /**
   * Whether the collapsible is disabled
   */
  disabled: boolean
  /**
   * Function to measure the size of the content.
   */
  measureSize: VoidFunction
  /**
   * Whether the collapsible is open.
   */
  open: boolean
  /**
   * Function to open or close the collapsible.
   */
  setOpen: (open: boolean) => void
  /**
   * Whether the collapsible is visible (open or closing)
   */
  visible: boolean

  // group: element bindings
  getContentBindings: (props: IdRegistrationProps) => CollapsibleContentBindings
  getRootBindings: () => CollapsibleRootBindings
  getTriggerBindings: (props: IdRegistrationProps) => CollapsibleTriggerBindings
}
