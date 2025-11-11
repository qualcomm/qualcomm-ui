// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DismissableElementHandlers} from "@qualcomm-ui/dom/dismissable"
import type {Placement, PositioningOptions} from "@qualcomm-ui/dom/floating-ui"
import type {TypeaheadState} from "@qualcomm-ui/dom/query"
import type {Point} from "@qualcomm-ui/dom/rect-utils"
import type {BooleanAriaAttr, BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  CommonProperties,
  EffectSchema,
  GuardSchema,
  IdRegistrationProps,
  JSX,
  Machine,
  MachineSchema,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

export interface ItemProps {
  /**
   * Whether the menu should be closed when the option is selected.
   */
  closeOnSelect?: boolean | undefined

  /**
   * Whether the menu item is disabled
   */
  disabled?: boolean | undefined

  /**
   * The function to call when the item is selected
   */
  onSelect?: (() => void) | undefined

  /**
   * The unique value of the menu item option.
   */
  value: string

  /**
   * The textual value of the option. Used in typeahead navigation of the menu.
   * If not provided, the text content of the menu item will be used.
   */
  valueText?: string | undefined
}

export interface ItemListenerProps {
  /**
   * The id of the item. Can be obtained from the `getItemState` function.
   */
  id: string

  /**
   * Function called when the item is selected
   */
  onSelect?: (() => void) | undefined
}

export interface OptionItemProps extends Partial<ItemProps> {
  /**
   * Whether the option is checked
   */
  checked?: boolean | undefined

  /**
   * Function called when the option state is changed
   */
  onCheckedChange?: ((checked: boolean) => void) | undefined

  /**
   * Whether the option is a radio or a checkbox
   */
  type: "radio" | "checkbox"

  /**
   * The value of the option
   */
  value: string
}

export interface CheckboxOptionItemProps
  extends Omit<OptionItemProps, "type"> {}

export interface GetOptionItemPropsReturn extends OptionItemProps {
  id: string
  valueText: string
}

export interface ItemState {
  /**
   * Whether the item is disabled
   */
  disabled: boolean

  /**
   * Whether the item is highlighted
   */
  highlighted: boolean

  /**
   * The unique id of the item
   */
  id: string
}

export interface ItemGroupContext {
  id: string
}

export interface RadioItemGroupContext {
  id: string
  onValueChange?: ((value: string) => void) | undefined
  value?: string | undefined
}

export interface OptionItemState extends ItemState {
  /**
   * Whether the option item is checked
   */
  checked: boolean
}

export interface ItemGroupProps {
  /**
   * The `id` of the element that provides accessibility label to the option group
   */
  id: string
}

export interface ItemGroupLabelProps {
  /**
   * The `id` of the group this refers to
   */
  htmlFor: string | undefined
}

export interface MenuNavigateDetails {
  href: string
  node: HTMLAnchorElement
  value: string
}

interface ItemApi {
  getItemBindings: (props: ItemProps) => MenuItemBindings
  getTriggerBindings: (props: IdRegistrationProps) => MenuTriggerBindings
}

export type MenuTriggerContextValue = (
  props: IdRegistrationProps,
) => MenuTriggerItemBindings | undefined

export interface MenuApiProps
  extends DirectionProperty,
    CommonProperties,
    DismissableElementHandlers {
  /**
   * The positioning point for the menu. Can be set by the context menu trigger or
   * the button trigger.
   */
  anchorPoint?: Point | null | undefined

  /**
   * Whether to close the menu when an option is selected
   * @default true
   */
  closeOnSelect?: boolean | undefined

  /**
   * Whether the menu is composed with other composite widgets like a combobox or tabs
   * @default true
   */
  composite?: boolean | undefined

  /**
   * The initial highlighted value of the menu item when rendered.
   * Use when you don't need to control the highlighted value of the menu item.
   */
  defaultHighlightedValue?: string | null | undefined

  /**
   * The initial open state of the menu when rendered.
   * Use when you don't need to control the open state of the menu.
   */
  defaultOpen?: boolean | undefined

  /**
   * The controlled highlighted value of the menu item.
   */
  highlightedValue?: string | null | undefined

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be automatically generated for accessibility.
   */
  id: string

  /**
   * Whether to loop the keyboard navigation.
   * @default false
   */
  loopFocus?: boolean | undefined

  /**
   * Function to navigate to the selected item if it's an anchor element
   */
  navigate?: ((details: MenuNavigateDetails) => void) | null | undefined

  /**
   * Function called when the highlighted menu item changes.
   */
  onHighlightChange?: ((value: string | null) => void) | undefined

  /**
   * Function called when the menu opens or closes
   */
  onOpenChange?: ((open: boolean) => void) | undefined

  /**
   * Function called when a menu item is selected.
   */
  onSelect?: ((value: string) => void) | undefined

  /**
   * The controlled open state of the menu
   */
  open?: boolean | undefined

  /**
   * The options used to dynamically position the menu
   * @inheritDoc
   */
  positioning?: PositioningOptions | undefined

  /**
   * Whether the pressing printable characters should trigger typeahead navigation
   * @default true
   */
  typeahead?: boolean | undefined
}

type PropsWithDefault =
  | "closeOnSelect"
  | "composite"
  | "dir"
  | "loopFocus"
  | "positioning"
  | "typeahead"

export type MenuState =
  | "idle"
  | "open"
  | "closed"
  | "opening"
  | "closing"
  | "opening:contextmenu"

export interface MenuElementIds {
  arrow: string
  content: string
  contextTrigger: string
  group: string
  positioner: string
  trigger: string
}

export type MenuScope = ScopeWithIds<MenuSchema>

type MenuEvent =
  | {
      type:
        | "OPEN"
        | "CLOSE"
        | "CONTEXT_MENU_CANCEL"
        | "TRIGGER_BLUR"
        | "TRIGGER_FOCUS"
        | "ARROW_UP"
        | "ARROW_LEFT"
        | "ARROW_RIGHT"
        | "ENTER"
        | "HOME"
        | "END"
        | "MENU_POINTERENTER"
        | "DELAY.OPEN"
        | "DELAY.CLOSE"
        | "LONG_PRESS.OPEN"
        | "POINTER_MOVED_AWAY_FROM_SUBMENU"
        | "HIGHLIGHTED.RESTORE"
        | "BLUR"
    }
  | {fromArrowKey: boolean; type: "FOCUS_MENU"}
  | {fromArrowKey: boolean; type: "OPEN_AUTOFOCUS"}
  | {type: "HIGHLIGHTED.SET"; value: string}
  | {id: string; type: "PARENT.SET"; value: Machine<MenuSchema>}
  | {id: string; type: "CHILD.SET"; value: Machine<MenuSchema>}
  | {options?: Partial<PositioningOptions> | undefined; type: "POSITIONING.SET"}
  | {point: Point; type: "CONTEXT_MENU_START"}
  | {point: Point; type: "CONTEXT_MENU"}
  | {point: Point; target: EventTarget; type: "TRIGGER_POINTERMOVE"}
  | {point: Point; target: EventTarget; type: "TRIGGER_POINTERLEAVE"}
  | {target: EventTarget; type: "TRIGGER_CLICK"}
  | {loop?: boolean; src?: "enter" | "space"; type: "ARROW_DOWN"}
  | {key: string; type: "TYPEAHEAD"}
  | {
      closeOnSelect?: boolean
      id: string
      loop?: boolean
      target: EventTarget
      type: "ITEM_POINTERMOVE"
    }
  | {
      closeOnSelect?: boolean
      id: string
      target: EventTarget
      type: "ITEM_POINTERLEAVE"
    }
  | {
      closeOnSelect?: boolean
      id: string
      target: EventTarget
      type: "ITEM_POINTERDOWN"
    }
  | {
      checked?: boolean | undefined
      closeOnSelect?: boolean
      id?: string
      option?: Pick<
        OptionItemProps,
        "checked" | "onCheckedChange" | "type" | "value"
      >
      target: EventTarget
      type: "ITEM_CLICK"
    }
  | {restoreFocus?: boolean; src?: string; type: "CLOSE"}
  | {previousEvent?: MenuEvent; type: "CONTROLLED.OPEN" | "CONTROLLED.CLOSE"}

export interface MenuSchema extends MachineSchema {
  actions: ActionSchema<
    | "setAnchorPoint"
    | "setSubmenuPlacement"
    | "reposition"
    | "setOptionState"
    | "clickHighlightedItem"
    | "setIntentPolygon"
    | "clearIntentPolygon"
    | "resumePointer"
    | "setHighlightedItem"
    | "clearHighlightedItem"
    | "focusMenu"
    | "highlightFirstItem"
    | "highlightLastItem"
    | "highlightNextItem"
    | "highlightPrevItem"
    | "invokeOnSelect"
    | "focusTrigger"
    | "highlightMatchedItem"
    | "setParentMenu"
    | "setChildMenu"
    | "closeRootMenu"
    | "openSubmenu"
    | "focusParentMenu"
    | "setLastHighlightedItem"
    | "restoreHighlightedItem"
    | "restoreParentHighlightedItem"
    | "invokeOnOpen"
    | "invokeOnClose"
    | "toggleVisibility"
  >
  computed: {
    highlightedId: string | null
    isRtl: boolean
    isSubmenu: boolean
    isTypingAhead: boolean
  }
  context: {
    anchorPoint: Point | null
    currentPlacement: Placement | undefined
    highlightedValue: string | null
    intentPolygon: Point[] | null
    itemFocusVisible: boolean
    lastHighlightedValue: string | null
    suspendPointer: boolean
  }
  effects: EffectSchema<
    | "waitForOpenDelay"
    | "waitForCloseDelay"
    | "waitForLongPress"
    | "trackPositioning"
    | "trackInteractOutside"
    | "trackPointerMove"
    | "scrollToHighlightedItem"
  >
  events: MenuEvent
  guards: GuardSchema<
    | "closeOnSelect"
    | "isTriggerItem"
    | "isTriggerItemHighlighted"
    | "isSubmenu"
    | "isPointerSuspended"
    | "isHighlightedItemEditable"
    | "isOpenControlled"
    | "isArrowLeftEvent"
    | "isArrowUpEvent"
    | "isArrowDownEvent"
    | "isOpenAutoFocusEvent"
  >
  ids: MenuElementIds
  props: RequiredBy<MenuApiProps, PropsWithDefault>
  refs: {
    children: Record<string, Machine<MenuSchema>>
    parent: Machine<MenuSchema> | null
    positioningOverride: Partial<PositioningOptions>
    typeaheadState: TypeaheadState
  }
  state: MenuState
  tag: "open" | "closed"
}

export interface MenuCommonBindings {
  "data-scope": "menu"
  dir: "ltr" | "rtl"
}

export interface MenuContextTriggerBindings extends MenuCommonBindings {
  "data-part": "context-trigger"
  id: string
  onContextMenu: JSX.MouseEventHandler
  onPointerCancel: JSX.PointerEventHandler
  onPointerDown: JSX.PointerEventHandler
  onPointerMove: JSX.PointerEventHandler
  onPointerUp: JSX.PointerEventHandler
  style: JSX.CSSProperties
}

export interface MenuTriggerItemBindings
  extends MenuCommonBindings,
    Omit<MenuItemBindings, "data-part">,
    MenuTriggerBindings {}

export interface MenuTriggerBindings extends MenuCommonBindings {
  "aria-controls": string | undefined
  "aria-expanded": BooleanAriaAttr
  "aria-haspopup": "menu" | "dialog"
  "data-part": "trigger" | "trigger-item"
  "data-placement": Placement | undefined
  "data-state": "open" | "closed"
  "data-uid": string
  id: string
  onBlur: JSX.FocusEventHandler
  onClick: JSX.MouseEventHandler
  onFocus: JSX.FocusEventHandler
  onKeyDown: JSX.KeyboardEventHandler
  onPointerDown: JSX.PointerEventHandler
  onPointerLeave: JSX.PointerEventHandler
  onPointerMove: JSX.PointerEventHandler
  type: "button"
}

export interface MenuPositionerBindings extends MenuCommonBindings {
  "data-part": "positioner"
  id: string
  style: JSX.CSSProperties
}

export interface MenuArrowBindings extends MenuCommonBindings {
  "data-part": "arrow"
  style: JSX.CSSProperties
}

export interface MenuArrowTipBindings extends MenuCommonBindings {
  "data-part": "arrow-tip"
  style: JSX.CSSProperties
}

export interface MenuContentBindings extends MenuCommonBindings {
  "aria-activedescendant": string | undefined
  "aria-labelledby": string | undefined
  "data-from": "context-trigger" | "trigger"
  "data-part": "content"
  "data-placement": Placement | undefined
  "data-state": "open" | "closed"
  hidden: boolean
  id: string
  onKeyDown: JSX.KeyboardEventHandler
  onPointerEnter: JSX.PointerEventHandler
  role: "menu" | "dialog"
  tabIndex: 0
}

export interface MenuSeparatorBindings extends MenuCommonBindings {
  "aria-orientation": "horizontal"
  "data-part": "separator"
  role: "separator"
}

export interface MenuItemBindings extends MenuCommonBindings {
  "aria-disabled": BooleanAriaAttr
  "data-disabled": BooleanDataAttr
  "data-focus-visible": BooleanDataAttr
  "data-highlighted": BooleanDataAttr
  "data-ownedby": string
  "data-part": "item"
  "data-value": string
  "data-valuetext": string | undefined
  id: string
  onClick: JSX.MouseEventHandler
  onDragStart: JSX.DragEventHandler
  onPointerDown: JSX.PointerEventHandler
  onPointerLeave: JSX.PointerEventHandler
  onPointerMove: JSX.PointerEventHandler
  role: "menuitem"
  tabIndex: -1
}

export interface MenuOptionItemBindings extends Omit<MenuItemBindings, "role"> {
  "aria-checked": BooleanAriaAttr
  "data-state": "checked" | "unchecked"
  "data-type": string
  role: string
}

export interface MenuOptionItemControlBindings {
  "data-disabled": BooleanDataAttr
  "data-part": "item-control"
  "data-state": "checked" | "unchecked"
}

export interface MenuItemIndicatorBindings extends MenuCommonBindings {
  "data-disabled": BooleanDataAttr
  "data-highlighted": BooleanDataAttr
  "data-part": "item-indicator"
  "data-state": "checked" | "unchecked" | undefined
  hidden: boolean | undefined
}

export interface MenuItemLabelBindings extends MenuCommonBindings {
  "data-disabled": BooleanDataAttr
  "data-highlighted": BooleanDataAttr
  "data-part": "item-text"
  "data-state": "checked" | "unchecked" | undefined
}

export interface MenuItemGroupLabelBindings extends MenuCommonBindings {
  "data-part": "item-group-label"
  id: string | undefined
}

export interface MenuItemGroupBindings extends MenuCommonBindings {
  "aria-labelledby": string | undefined
  "data-part": "item-group"
  id: string
  role: "group"
}

export interface MenuApi {
  /**
   * Setup the custom event listener for item selection event
   */
  addItemListener: (props: ItemListenerProps) => VoidFunction | undefined

  /**
   * Returns the state of the menu item
   */
  getItemState: (props: ItemProps) => ItemState

  /**
   * Returns the state of the option item
   */
  getOptionItemState: (props: OptionItemProps) => OptionItemState

  /**
   * The id of the currently highlighted menuitem
   */
  highlightedValue: string | null

  /**
   * Whether the menu is open
   */
  open: boolean

  /**
   * Function to reposition the popover
   */
  reposition: (options?: Partial<PositioningOptions>) => void

  /**
   * Function to register a child menu. This is used for submenus
   */
  setChild: (child: Machine<MenuSchema>) => void

  /**
   * Function to set the highlighted menuitem
   */
  setHighlightedValue: (value: string) => void

  /**
   * Function to open or close the menu
   */
  setOpen: (open: boolean) => void

  /**
   * Function to register a parent menu. This is used for submenus
   */
  setParent: (parent: Machine<MenuSchema>) => void

  // group: prop getters
  getArrowBindings: () => MenuArrowBindings
  getArrowTipBindings: () => MenuArrowTipBindings
  getContentBindings: (props: IdRegistrationProps) => MenuContentBindings
  getContextTriggerBindings: (
    props: IdRegistrationProps,
  ) => MenuContextTriggerBindings
  getItemBindings: (options: ItemProps) => MenuItemBindings
  getItemGroupBindings: (options: ItemGroupProps) => MenuItemGroupBindings
  getItemGroupLabelBindings: (
    options: ItemGroupLabelProps,
  ) => MenuItemGroupLabelBindings
  getItemIndicatorBindings: (option: ItemProps) => MenuItemIndicatorBindings
  getItemLabelBindings: (option: ItemProps) => MenuItemLabelBindings
  getOptionItemBindings: (option: OptionItemProps) => MenuOptionItemBindings
  getOptionItemControlBindings: (
    option: OptionItemProps,
  ) => MenuOptionItemControlBindings
  getPositionerBindings: (props: IdRegistrationProps) => MenuPositionerBindings
  getSeparatorBindings: () => MenuSeparatorBindings
  getTriggerBindings: (props: IdRegistrationProps) => MenuTriggerBindings
  getTriggerItemBindings: <Api extends ItemApi>(
    childApi: Api,
    props: IdRegistrationProps,
  ) => MenuTriggerItemBindings
}
