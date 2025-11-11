// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  BindableIds,
  CommonProperties,
  IdRegistrationProps,
  JSX,
  MachineSchema,
  Scope,
} from "@qualcomm-ui/utils/machine"

export interface SideNavApiProps extends CommonProperties, DirectionProperty {
  /**
   * The initial open state of the side navigation when rendered.
   * Use when you don't need to control the open state of the collapsible.
   *
   * @default true
   */
  defaultOpen?: boolean | undefined

  /**
   * Whether the collapsible is disabled.
   */
  disabled?: boolean | undefined

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

export type SideNavState = "open" | "closed" | "closing"

export interface SideNavElementIds {
  root: string
  trigger: string
}

export interface SideNavScope extends Scope {
  ids: BindableIds<SideNavSchema>
}

export interface SideNavSchema extends MachineSchema {
  actions: ActionSchema<"invokeOnOpen" | "invokeOnClose" | "toggleOpen">
  context: {
    open: boolean
  }
  events: {type: "open"} | {type: "close"}
  ids: SideNavElementIds
  props: RequiredBy<SideNavApiProps, "dir">
  state: SideNavState
}

export interface SideNavCommonBindings extends DirectionProperty {
  "data-scope": "side-nav"
}

export interface SideNavRootBindings extends SideNavCommonBindings {
  "data-collapsible": BooleanDataAttr
  "data-disabled": BooleanDataAttr
  "data-part": "root"
  "data-state": SideNavState
  id: string
}

export interface SideNavHeaderBindings extends SideNavCommonBindings {
  "data-part": "header"
  "data-state": SideNavState
}

export interface SideNavHeaderLogoBindings extends SideNavCommonBindings {
  "data-part": "header-logo"
  hidden: boolean
}

export interface SideNavHeaderTitleBindings extends SideNavCommonBindings {
  "data-part": "header-title"
  hidden: boolean
}

export interface SideNavHeaderActionBindings extends SideNavCommonBindings {
  "data-part": "header-action"
  "data-state": SideNavState
}

export interface SideNavTriggerBindings extends SideNavCommonBindings {
  "aria-controls": string
  "aria-expanded": BooleanAriaAttr
  "data-disabled": BooleanDataAttr
  "data-part": "trigger"
  "data-state": SideNavState
  id: string
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface SideNavApi {
  /**
   * Whether the side navigation open/close behavior is disabled
   */
  disabled: boolean

  /**
   * Whether the side navigation is open.
   */
  open: boolean

  /**
   * Function to open or close the side navigation.
   */
  setOpen: (open: boolean) => void

  // group: element bindings
  getHeaderActionBindings: () => SideNavHeaderActionBindings
  getHeaderBindings: () => SideNavHeaderBindings
  getHeaderLogoBindings: () => SideNavHeaderLogoBindings
  getHeaderTitleBindings: () => SideNavHeaderTitleBindings
  getRootBindings: (props: IdRegistrationProps) => SideNavRootBindings
  getTriggerBindings: (props: IdRegistrationProps) => SideNavTriggerBindings
}
