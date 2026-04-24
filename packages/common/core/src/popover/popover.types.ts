// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  DismissableElementHandlers,
  PersistentElementOptions,
} from "@qualcomm-ui/dom/dismissable"
import type {Placement, PositioningOptions} from "@qualcomm-ui/dom/floating-ui"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
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

import type {popoverAnatomy} from "./popover.anatomy"

export interface PopoverApiProps
  extends
    CommonProperties,
    DirectionProperty,
    DismissableElementHandlers,
    PersistentElementOptions {
  /**
   * Whether to automatically set focus on the first focusable
   * content within the popover when opened.
   *
   * @default true
   */
  autoFocus?: boolean | undefined

  /**
   * Whether to close the popover when the escape key is pressed.
   *
   * @default true
   */
  closeOnEscape?: boolean | undefined

  /**
   * Whether to close the popover when the user clicks outside the popover.
   *
   * @default true
   */
  closeOnInteractOutside?: boolean | undefined

  /**
   * The initial open state of the popover when rendered.
   * Use when you don't need to control the open state of the popover.
   */
  defaultOpen?: boolean | undefined

  /**
   * The ids of the popover elements. These will be automatically generated if
   * omitted.
   */
  ids?: Partial<PopoverElementIds> | undefined

  /**
   * The element to focus on when the popover is opened.
   */
  initialFocusEl?: (() => HTMLElement | null) | undefined

  /**
   * Whether the popover should be modal. When set to `true`:
   * - interaction with outside elements will be disabled
   * - only popover content will be visible to screen readers
   * - scrolling is blocked
   * - focus is trapped within the popover
   *
   * @default false
   */
  modal?: boolean | undefined

  /**
   * Function invoked when the popover opens or closes
   */
  onOpenChange?: (
    /**
     * The next value of the open state.
     */
    open: boolean,
  ) => void

  /**
   * The controlled open state of the popover
   */
  open?: boolean | undefined

  /**
   * Whether the popover is portalled. This will proxy the tabbing behavior
   * regardless of the DOM position of the popover content.
   *
   * @default true
   */
  portalled?: boolean | undefined

  /**
   * The options used to position the popover content.
   *
   * @inheritDoc
   */
  positioning?: PopoverPositioningOptions | undefined

  /**
   * On close, restore focus to the element that triggered the open event.
   *
   * @default true
   */
  restoreFocus?: boolean | undefined
}

export interface PopoverPositioningOptions extends PositioningOptions {
  /**
   * The initial placement of the floating element
   *
   * @default 'top'
   */
  placement?: Placement | undefined
}

interface PrivateContext {
  /**
   * The computed floating placement of the popover
   */
  currentPlacement: Placement | undefined
}

interface Computed {
  currentPortalled: boolean
}

type PropsWithDefault =
  | "autoFocus"
  | "closeOnEscape"
  | "closeOnInteractOutside"
  | "modal"
  | "portalled"
  | "positioning"

export interface PopoverElementIds {
  anchor: string
  arrow: string
  closeTrigger: string
  content: string
  description: string
  positioner: string
  title: string
  trigger: string
}

export interface PopoverScope extends Scope {
  ids: BindableIds<PopoverSchema>
}

export interface PopoverSchema extends MachineSchema {
  actions: ActionSchema<
    | "invokeOnClose"
    | "invokeOnOpen"
    | "reposition"
    | "setFinalFocus"
    | "setInitialFocus"
    | "toggleVisibility"
  >
  computed: Computed
  context: PrivateContext
  effects: EffectSchema<
    | "hideContentBelow"
    | "preventScroll"
    | "proxyTabFocus"
    | "trackDismissableElement"
    | "trackPositioning"
    | "trapFocus"
  >
  events:
    | {
        event?: unknown
        restoreFocus?: boolean
        src?: "interact-outside"
        type: "CLOSE"
      }
    | {
        restoreFocus?: boolean
        type: "CONTROLLED.CLOSE"
      }
    | {
        restoreFocus?: boolean
        type: "CONTROLLED.OPEN"
      }
    | {event?: unknown; type: "OPEN"}
    | {
        options: Partial<PositioningOptions>
        type: "POSITIONING.SET"
      }
    | {event?: unknown; type: "TOGGLE"}
  guards: GuardSchema<"isOpenControlled">
  ids: PopoverElementIds
  props: RequiredBy<PopoverApiProps, PropsWithDefault>
  state: "closed" | "open"
}

type PartName = AnatomyPartName<typeof popoverAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"popover", P> {}

export interface PopoverRootBindings extends Part<"root"> {
  dir: Direction
}

export interface PopoverAnchorBindings extends Part<"anchor"> {
  id: string
}

export interface PopoverArrowBindings extends Part<"arrow"> {
  id: string
  style: JSX.CSSProperties
}

export interface PopoverArrowTipBindings extends Part<"arrowTip"> {
  style: JSX.CSSProperties
}

export interface PopoverTriggerBindings extends Part<"trigger"> {
  "aria-controls": string
  "aria-expanded": BooleanAriaAttr
  "aria-haspopup": "dialog"
  "data-placement": Placement | undefined
  "data-state": PopoverSchema["state"]
  id: string
  onClick: JSX.MouseEventHandler<HTMLButtonElement>
  onPointerDown: JSX.PointerEventHandler<HTMLButtonElement>
  type: "button"
}

export interface PopoverIndicatorBindings extends Part<"indicator"> {
  "data-state": PopoverSchema["state"]
}

export interface PopoverPositionerBindings extends Part<"positioner"> {
  id: string
  style: JSX.CSSProperties
}

export interface PopoverContentBindings extends Part<"content"> {
  "aria-describedby": string | undefined
  "aria-labelledby": string | undefined
  "data-expanded": BooleanDataAttr
  "data-placement": Placement | undefined
  "data-state": PopoverSchema["state"]
  hidden: boolean | undefined
  id: string
  role: "dialog"
  tabIndex: -1
}

export interface PopoverLabelBindings extends Part<"label"> {
  id: string
}

export interface PopoverDescriptionBindings extends Part<"description"> {
  id: string
}

export interface PopoverCloseTriggerBindings extends Part<"closeTrigger"> {
  "aria-label": string
  id: string
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface PopoverApi {
  getAnchorBindings(props: IdRegistrationProps): PopoverAnchorBindings
  getArrowBindings(props: IdRegistrationProps): PopoverArrowBindings
  getArrowTipBindings(): PopoverArrowTipBindings
  getCloseTriggerBindings(
    props: IdRegistrationProps,
  ): PopoverCloseTriggerBindings
  getContentBindings(props: IdRegistrationProps): PopoverContentBindings
  getDescriptionBindings(props: IdRegistrationProps): PopoverDescriptionBindings
  getIndicatorBindings(): PopoverIndicatorBindings
  getLabelBindings(props: IdRegistrationProps): PopoverLabelBindings
  getPositionerBindings(props: IdRegistrationProps): PopoverPositionerBindings
  getRootBindings(): PopoverRootBindings
  getTriggerBindings(props: IdRegistrationProps): PopoverTriggerBindings

  open: boolean
  portalled: boolean
  reposition: (options?: Partial<PositioningOptions>) => void
  setOpen: (details: {event?: Event; open: boolean}) => void
}
