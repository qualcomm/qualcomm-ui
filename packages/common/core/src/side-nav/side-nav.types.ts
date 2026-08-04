// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
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

import type {sideNavAnatomy} from "./side-nav.anatomy.js"

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

type PartName = AnatomyPartName<typeof sideNavAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"sideNav", P> {}

export interface SideNavRootBindings extends Part<"root"> {
  "data-collapsible": BooleanDataAttr
  "data-disabled": BooleanDataAttr
  "data-state": SideNavState
  id: string
}

export interface SideNavHeaderBindings extends Part<"header"> {
  "data-state": SideNavState
}

export interface SideNavHeaderLogoBindings extends Part<"headerLogo"> {
  hidden: boolean
}

export interface SideNavHeaderTitleBindings extends Part<"headerTitle"> {
  hidden: boolean
}

export interface SideNavHeaderActionBindings extends Part<"headerAction"> {
  "data-state": SideNavState
}

export interface SideNavTriggerBindings extends Part<"trigger"> {
  "aria-controls": string
  "aria-expanded": BooleanAriaAttr
  "aria-label": "Collapse" | "Expand"
  "data-disabled": BooleanDataAttr
  "data-state": SideNavState
  id: string
  onClick: JSX.MouseEventHandler
  role: "treeitem"
}

export interface SideNavFilterInputBindings extends Part<"filterInput"> {
  role: "treeitem"
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
  getFilterInputBindings: () => SideNavFilterInputBindings
  getHeaderActionBindings: () => SideNavHeaderActionBindings
  getHeaderBindings: () => SideNavHeaderBindings
  getHeaderLogoBindings: () => SideNavHeaderLogoBindings
  getHeaderTitleBindings: () => SideNavHeaderTitleBindings
  getRootBindings: (props: IdRegistrationProps) => SideNavRootBindings
  getTriggerBindings: (props: IdRegistrationProps) => SideNavTriggerBindings
}
