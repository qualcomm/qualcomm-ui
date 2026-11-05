// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  DismissableElementHandlers,
  PersistentElementOptions,
} from "@qualcomm-ui/dom/dismissable"
import type {MaybeElement} from "@qualcomm-ui/dom/interact-outside"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanAriaAttr} from "@qualcomm-ui/utils/attributes"
import type {Direction, DirectionProperty} from "@qualcomm-ui/utils/direction"
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

import type {dialogAnatomy} from "./dialog.anatomy.js"

export interface DialogApiProps
  extends
    DirectionProperty,
    CommonProperties,
    DismissableElementHandlers,
    PersistentElementOptions {
  /**
   * Human readable label for the dialog, used when the dialog title is not rendered
   */
  "aria-label"?: string | undefined

  /**
   * Whether to close the dialog when the escape key is pressed
   *
   * @default true
   */
  closeOnEscape?: boolean | undefined

  /**
   * Whether to close the dialog when the outside is clicked
   *
   * @default true
   */
  closeOnInteractOutside?: boolean | undefined

  /**
   * The initial open state of the dialog when rendered.
   * Use when you don't need to control the open state of the dialog.
   *
   * @default false
   */
  defaultOpen?: boolean | undefined

  /**
   * Element to receive focus when the dialog is closed
   */
  finalFocusEl?: (() => MaybeElement) | undefined

  /**
   * Element to receive focus when the dialog is opened
   */
  initialFocusEl?: (() => MaybeElement) | undefined

  /**
   * Whether to prevent pointer interaction outside the element and hide all content
   * below it
   *
   * @default true
   */
  modal?: boolean | undefined

  /**
   * Function invoked when the dialog opens or closes
   *
   * @param open The next value of the open state.
   */
  onOpenChange?: (open: boolean) => void

  /**
   * The controlled open state of the dialog
   */
  open?: boolean | undefined

  /**
   * Whether to prevent scrolling behind the dialog when it's opened
   *
   * @default true
   */
  preventScroll?: boolean | undefined

  /**
   * Whether to restore focus to the element that had focus before the dialog was
   * opened
   *
   * @default true
   */
  restoreFocus?: boolean | undefined

  /**
   * The dialog's role
   *
   * @default 'dialog'
   */
  role?: "dialog" | "alertdialog" | undefined

  /**
   * Whether to trap focus inside the dialog when it's opened
   *
   * @default true
   */
  trapFocus?: boolean | undefined
}

export interface DialogElementIds {
  backdrop: string
  closeTrigger: string
  content: string
  description: string
  label: string
  positioner: string
  trigger: string
}

export interface DialogScope extends Scope {
  ids: BindableIds<DialogSchema>
}

export interface DialogSchema extends MachineSchema {
  actions: ActionSchema<
    "invokeOnClose" | "invokeOnOpen" | "syncZIndex" | "toggleVisibility"
  >
  effects: EffectSchema<
    | "hideContentBelow"
    | "preventScroll"
    | "trackDismissableElement"
    | "trapFocus"
  >
  events:
    | {
        src?: string
        type: "CLOSE"
      }
    | {
        type: "CONTROLLED.CLOSE"
      }
    | {type: "CONTROLLED.OPEN"}
    | {type: "OPEN"}
    | {type: "TOGGLE"}
  guards: GuardSchema<"isOpenControlled">
  ids: DialogElementIds
  props: RequiredBy<
    DialogApiProps,
    | "closeOnEscape"
    | "closeOnInteractOutside"
    | "dir"
    | "initialFocusEl"
    | "modal"
    | "preventScroll"
    | "restoreFocus"
    | "role"
    | "trapFocus"
  >
  state: "open" | "closed"
}

type PartName = AnatomyPartName<typeof dialogAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"dialog", P> {}

export interface DialogTriggerBindings extends Part<"trigger"> {
  "aria-controls": string
  "aria-expanded": BooleanAriaAttr
  "aria-haspopup": "dialog"
  "data-state": "open" | "closed"
  id: string
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface DialogBackdropBindings extends Part<"backdrop"> {
  "data-state": DialogSchema["state"]
  hidden: boolean
  id: string
}

export interface DialogPositionerBindings extends Part<"positioner"> {
  dir: Direction
  id: string
  style: JSX.CSSProperties
}

export interface DialogContentBindings extends Part<"content"> {
  "aria-describedby": string | undefined
  "aria-label": string | undefined
  "aria-labelledby": string | undefined
  "aria-modal": boolean
  "data-state": "open" | "closed"
  hidden: boolean
  id: string
  role: NonNullable<DialogApiProps["role"]>
  tabIndex: -1
}

export interface DialogHeadingBindings extends Part<"heading"> {
  id: string
}

export interface DialogDescriptionBindings extends Part<"description"> {
  id: string
}

export interface DialogBodyBindings extends Part<"body"> {}

export interface DialogCloseTriggerBindings extends Part<"closeTrigger"> {
  id: string
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface DialogFooterBindings extends Part<"footer"> {}

export interface DialogApi {
  open: boolean
  setOpen: (open: boolean) => void

  // group: bindings
  getBackdropBindings(props: IdRegistrationProps): DialogBackdropBindings
  getBodyBindings(): DialogBodyBindings
  getCloseTriggerBindings(
    props: IdRegistrationProps,
  ): DialogCloseTriggerBindings
  getContentBindings(props: IdRegistrationProps): DialogContentBindings
  getDescriptionBindings(props: IdRegistrationProps): DialogDescriptionBindings
  getFooterBindings(): DialogFooterBindings
  getHeadingBindings(props: IdRegistrationProps): DialogHeadingBindings
  getPositionerBindings(props: IdRegistrationProps): DialogPositionerBindings
  getTriggerBindings(props: IdRegistrationProps): DialogTriggerBindings
}
