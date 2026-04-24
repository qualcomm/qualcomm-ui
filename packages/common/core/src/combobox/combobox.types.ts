// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

import type {Placement, PositioningOptions} from "@qualcomm-ui/dom/floating-ui"
import type {InteractOutsideHandlers} from "@qualcomm-ui/dom/interact-outside"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {
  CollectionItem,
  ListCollection,
} from "@qualcomm-ui/utils/collection"
import type {Direction, DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  CommonProperties,
  EffectSchema,
  GuardSchema,
  IdRegistrationProps,
  JSX,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

import type {comboboxAnatomy} from "./combobox.anatomy"

export interface ComboboxValueChangeDetails<
  T extends CollectionItem = CollectionItem,
> {
  items: T[]
  value: string[]
}

export interface ComboboxHighlightChangeDetails<
  T extends CollectionItem = CollectionItem,
> {
  highlightedItem: T | null
  highlightedValue: string | null
}

/**
 * The reason for the input value change
 */
export type ComboboxInputValueChangeReason =
  | "input-change" // User typed in the input
  | "item-select" // Item was selected and input value changed based on selection behavior
  | "clear-trigger" // Clear button was clicked
  | "script" // Programmatically changed
  | "interact-outside" // User clicked outside or blurred the input

export interface ComboboxInputValueChangeDetails {
  inputValue: string
  reason?: ComboboxInputValueChangeReason | undefined
}

/**
 * The reason for the combobox open/close state change
 */
export type ComboboxOpenChangeReason =
  | "input-click" // User clicked the input
  | "trigger-click" // User clicked the trigger button
  | "script" // Programmatically changed
  | "arrow-key" // User pressed arrow keys or used the listbox navigation keys
  | "input-change" // Input value changed
  | "interact-outside" // User clicked outside
  | "escape-key" // User pressed escape
  | "item-select" // User selected an item
  | "clear-trigger" // User clicked clear button
  | "input-focus" // User focuses the input

export interface ComboboxOpenChangeDetails {
  open: boolean
  reason?: ComboboxOpenChangeReason | undefined
}

export interface ComboboxScrollToIndexDetails {
  getElement: () => HTMLElement | null
  immediate?: boolean | undefined
  index: number
}

export interface NavigateDetails {
  href: string
  node: HTMLAnchorElement
  value: string
}

export interface ComboboxSelectionDetails {
  itemValue: string
  value: string[]
}

/* -----------------------------------------------------------------------------
 * Machine context
 * ----------------------------------------------------------------------------- */

export interface IntlTranslations {
  clearTriggerLabel?: string | undefined
  triggerLabel?: string | undefined
}

export interface ComboboxApiProps<T extends CollectionItem = CollectionItem>
  extends DirectionProperty, CommonProperties, InteractOutsideHandlers {
  /**
   * Whether to allow typing custom values in the input
   */
  allowCustomValue?: boolean | undefined

  /**
   * Whether to always submit on Enter key press, even if popup is open.
   * Useful for single-field autocomplete forms where Enter should submit the form.
   * @default false
   */
  alwaysSubmitOnEnter?: boolean | undefined

  /**
   * Whether to autofocus the input on mount
   */
  autoFocus?: boolean | undefined

  /**
   * Whether to close the combobox when an item is selected.
   */
  closeOnSelect?: boolean | undefined

  /**
   * The collection of items
   *
   * @inheritDoc
   */
  collection?: ListCollection<T> | undefined

  /**
   * Whether the combobox is a composed with other composite widgets like tabs
   * @default true
   */
  composite?: boolean | undefined

  /**
   * The initial highlighted value of the combobox when rendered.
   * Use when you don't need to control the highlighted value of the combobox.
   */
  defaultHighlightedValue?: string | null | undefined

  /**
   * The initial value of the combobox's input when rendered.
   * Use when you don't need to control the value of the combobox's input.
   * @default ""
   */
  defaultInputValue?: string | undefined

  /**
   * The initial open state of the combobox when rendered.
   * Use when you don't need to control the open state of the combobox.
   */
  defaultOpen?: boolean | undefined

  /**
   * The initial value of the combobox's selected items when rendered.
   * Use when you don't need to control the value of the combobox's selected items.
   * @default []
   */
  defaultValue?: string[] | undefined

  /**
   * Whether the combobox is disabled
   */
  disabled?: boolean | undefined

  /**
   * Whether to disable registering this as a dismissable layer
   */
  disableLayer?: boolean | undefined

  /**
   * The associate form of the combobox.
   */
  form?: string | undefined

  /**
   * The controlled highlighted value of the combobox
   */
  highlightedValue?: string | null | undefined

  /**
   * The ids of the combobox's elements. If omitted, these will be generated
   * automatically.
   */
  ids?: Partial<ComboboxElementIds> | undefined

  /**
   * Defines the auto-completion behavior of the combobox.
   *
   * - `autohighlight`: The first focused item is highlighted as the user types
   * - `autocomplete`: Navigating the listbox with the arrow keys selects the item
   * and the input is updated
   *
   * @default "none"
   */
  inputBehavior?: "autohighlight" | "autocomplete" | "none" | undefined

  /**
   * The controlled value of the combobox's input
   */
  inputValue?: string | undefined

  /**
   * Whether the combobox is invalid
   */
  invalid?: boolean | undefined

  /**
   * Whether to loop the keyboard navigation through the items
   * @default true
   */
  loopFocus?: boolean | undefined

  /**
   * Whether to allow multiple selection.
   *
   * When `multiple` is `true`, the `selectionBehavior` is automatically set to
   * `clear`. It's recommended to render the selected items in a separate container.
   */
  multiple?: boolean | undefined

  /**
   * The `name` attribute of the combobox's input. Useful for form submission
   */
  name?: string | undefined

  /**
   * Function called when an item is highlighted using the pointer
   * or keyboard navigation.
   */
  onHighlightChange?:
    | ((details: ComboboxHighlightChangeDetails<T>) => void)
    | undefined

  /**
   * Function called when the input's value changes
   */
  onInputValueChange?:
    | ((details: ComboboxInputValueChangeDetails) => void)
    | undefined

  /**
   * Function called when the popup is opened
   */
  onOpenChange?: ((details: ComboboxOpenChangeDetails) => void) | undefined

  /**
   * Function called when an item is selected
   */
  onSelect?: ((details: ComboboxSelectionDetails) => void) | undefined

  /**
   * Function called when a new item is selected
   */
  onValueChange?: ((details: ComboboxValueChangeDetails<T>) => void) | undefined

  /**
   * The controlled open state of the combobox
   */
  open?: boolean | undefined

  /**
   * Whether to show the combobox when the input value changes
   * @default true
   */
  openOnChange?:
    | boolean
    | ((details: ComboboxInputValueChangeDetails) => boolean)
    | undefined

  /**
   * Whether to open the combobox popup on initial click on the input
   * @default false
   */
  openOnClick?: boolean | undefined

  /**
   * Whether to open the combobox on arrow key press
   * @default true
   */
  openOnKeyPress?: boolean | undefined

  /**
   * The placeholder text of the combobox's input
   */
  placeholder?: string | undefined

  /**
   * The positioning options to dynamically position the popup menu
   *
   * @inheritDoc
   */
  positioning?: ComboboxPositioningOptions | undefined

  /**
   * Whether the combobox is readonly. This puts the combobox in a "non-editable"
   * mode but the user can still interact with it
   */
  readOnly?: boolean | undefined

  /**
   * Whether the combobox is a required input field
   */
  required?: boolean | undefined

  /**
   * Function to scroll to a specific index
   */
  scrollToIndexFn?:
    | ((details: ComboboxScrollToIndexDetails) => void)
    | undefined

  /**
   * The behavior of the combobox input when an item is selected
   *
   * - `replace`: The selected item string is set as the input value
   * - `clear`: The input value is cleared
   * - `preserve`: The input value is preserved
   *
   * @default "replace"
   */
  selectionBehavior?: "clear" | "replace" | "preserve" | undefined

  /**
   * Specifies the localized strings that identifies the accessibility elements and
   * their states
   */
  translations?: IntlTranslations | undefined

  /**
   * The controlled value of the combobox's selected items
   */
  value?: string[] | undefined
}

export interface ComboboxPositioningOptions extends PositioningOptions {
  /**
   * The main axis offset or gap between the reference and floating element
   * @default 2
   */
  gutter?: number | undefined

  /**
   * The initial placement of the floating element
   * @default 'bottom-start'
   */
  placement?: Placement | undefined

  /**
   * Whether to make the floating element same width as the reference element
   *
   * @default true
   */
  sameWidth?: boolean | undefined
}

export interface ComboboxScope extends ScopeWithIds<ComboboxSchema> {}

export interface ComboboxElementIds {
  clearTrigger: string
  content: string
  control: string
  errorText: string
  hint: string
  input: string
  label: string
  positioner: string
  root: string
  trigger: string
}

type PropsWithDefault =
  | "closeOnSelect"
  | "collection"
  | "composite"
  | "inputBehavior"
  | "loopFocus"
  | "openOnChange"
  | "openOnClick"
  | "openOnKeyPress"
  | "positioning"
  | "selectionBehavior"
  | "translations"

export interface ComboboxSchema<T extends CollectionItem = CollectionItem> {
  actions: ActionSchema<
    | "autofillInputValue"
    | "clearHighlightedValue"
    | "clearInputValue"
    | "clearItem"
    | "clearSelectedItems"
    | "highlightFirstItem"
    | "highlightFirstItemIfNeeded"
    | "highlightFirstOrSelectedItem"
    | "highlightFirstSelectedItem"
    | "highlightLastItem"
    | "highlightLastOrSelectedItem"
    | "highlightNextItem"
    | "highlightPrevItem"
    | "invokeOnClose"
    | "invokeOnOpen"
    | "reposition"
    | "revertInputValue"
    | "scrollContentToTop"
    | "scrollToHighlightedItem"
    | "selectHighlightedItem"
    | "selectItem"
    | "setFinalFocus"
    | "setHighlightedValue"
    | "setInitialFocus"
    | "setInputValue"
    | "setValue"
    | "syncHighlightedItem"
    | "syncInputFocus"
    | "syncInputValue"
    | "syncSelectedItems"
    | "toggleVisibility"
  >
  computed: {
    autoComplete: boolean
    autoHighlight: boolean
    hasSelectedItems: boolean
    isCustomValue: boolean
    isInputValueEmpty: boolean
    isInteractive: boolean
    valueAsString: string
  }
  context: {
    currentPlacement?: Placement | undefined
    highlightedItem: T | null
    highlightedValue: string | null
    inputValue: string
    selectedItems: T[]
    value: string[]
  }
  effects: EffectSchema<
    | "hideOtherElements"
    | "scrollToHighlightedItem"
    | "trackDismissableLayer"
    | "trackPlacement"
    | "trackFocusVisible"
  >
  events: {
    previousEvent?: ComboboxSchema["events"]
    src?: ComboboxOpenChangeReason
  } & (
    | {
        type: "TAG.DISMISS"
        value: string
      }
    | {
        options: Partial<PositioningOptions> | undefined
        type: "POSITIONING.SET"
      }
    | {
        type: "ITEM.SELECT"
        value: string
      }
    | {
        src?: string
        type: "ITEM.CLICK"
        value: string
      }
    | {
        type: "CHILDREN_CHANGE"
      }
    | {type: "CONTROLLED.CLOSE"}
    | {type: "INPUT.BLUR"}
    | {src?: "input-focus"; type: "INPUT.FOCUS"}
    | {src: "input-click"; type: "INPUT.CLICK"}
    | {type: "CONTROLLED.OPEN"}
    | {type: "VALUE.SET"; value: string[]}
    | {type: "ITEM.CLEAR"; value: string | undefined}
    | {type: "SELECTED_ITEMS.SYNC"}
    | {type: "HIGHLIGHTED_VALUE.CLEAR" | "VALUE.CLEAR"}
    | {type: "HIGHLIGHTED_VALUE.SET"; value: string}
    | {type: "ITEM.POINTER_MOVE" | "ITEM.POINTER_LEAVE"; value: string}
    | {
        keypress?: boolean
        src: "arrow-key"
        type: "INPUT.ARROW_DOWN" | "INPUT.ARROW_UP"
      }
    | {
        keypress?: boolean
        type: "OPEN" | "CLOSE"
      }
    | {keypress: boolean; src: "item-select"; type: "INPUT.ENTER"}
    | {keypress: boolean; type: "INPUT.END"}
    | {keypress: boolean; src: "escape-key"; type: "INPUT.ESCAPE"}
    | {keypress: boolean; type: "INPUT.HOME"}
    | {
        src: ComboboxInputValueChangeReason
        type: "INPUT_VALUE.SET" | "INPUT.CHANGE"
        value: string
      }
    | {src: "escape-key"; type: "LAYER.ESCAPE"}
    | {
        restoreFocus: boolean | undefined
        src: "interact-outside"
        type: "LAYER.INTERACT_OUTSIDE"
      }
    | {src: "trigger-click"; type: "TRIGGER.CLICK"}
  )

  guards: GuardSchema<
    | "allowCustomValue"
    | "autoComplete"
    | "autoFocus"
    | "autoHighlight"
    | "closeOnSelect"
    | "hasHighlightedItem"
    | "isChangeEvent"
    | "isCustomValue"
    | "isFirstItemHighlighted"
    | "isHighlightedItemRemoved"
    | "isInputValueEmpty"
    | "isLastItemHighlighted"
    | "isOpenControlled"
    | "openOnChange"
    | "restoreFocus"
  >
  ids: ComboboxElementIds
  props: RequiredBy<ComboboxApiProps<T>, PropsWithDefault>
  refs: {
    scrollToIndexFn:
      | ((details: ComboboxScrollToIndexDetails) => void)
      | null
      | undefined
  }
  state: "idle" | "focused" | "suggesting" | "interacting"
  tag: "open" | "focused" | "idle" | "closed"
}

export interface ComboboxApiTriggerProps {
  /**
   * Whether the trigger is focusable
   */
  focusable?: boolean | undefined
}

export interface ComboboxApiItemProps<T extends CollectionItem> {
  /**
   * The item to render
   */
  item: T
  /**
   * Whether hovering outside should clear the highlighted state
   */
  persistFocus?: boolean | undefined
}

export interface ComboboxItemState {
  /**
   * Whether the item is disabled
   */
  disabled: boolean | undefined
  /**
   * Whether the item is highlighted via pointer or keyboard navigation
   */
  highlighted: boolean
  /**
   * Whether the item is selected
   */
  selected: boolean
  /**
   * The value of the item
   */
  value: string
}

export interface ComboboxItemContext
  extends ComboboxApiItemProps<CollectionItem>, ComboboxItemState {}

export interface ComboboxApiItemGroupProps {
  id: string
}

export interface ComboboxApiItemGroupLabelProps {
  htmlFor: string
}

export interface ComboboxApi<T extends CollectionItem = CollectionItem> {
  /**
   * Function to clear the highlighted value
   */
  clearHighlightValue: () => void

  /**
   * Function to clear the value of the combobox
   */
  clearValue: (value?: string) => void

  /**
   * Function to toggle the combobox
   *
   * @inheritDoc
   */
  collection: ListCollection<T>

  /**
   * Whether the combobox is disabled
   */
  disabled: boolean

  /**
   * Function to focus on the combobox input
   */
  focus: () => void

  /**
   * Whether the combobox is focused
   */
  focused: boolean

  /**
   * Returns the state of a combobox item
   */
  getItemState: (props: ComboboxApiItemProps<T>) => ComboboxItemContext

  /**
   * Whether there's a selected item
   */
  hasSelectedItems: boolean

  /**
   * The highlighted item
   */
  highlightedItem: T | null

  /**
   * The value of the highlighted item
   */
  highlightedValue: string | null

  /**
   * The value of the combobox input
   */
  inputValue: string

  /**
   * Whether the combobox allows multiple selections
   */
  multiple: boolean

  /**
   * Whether the combobox is open
   */
  open: boolean

  /**
   * Function to set the positioning options
   */
  reposition: (options?: Partial<PositioningOptions>) => void

  /**
   * Whether the combobox is a required input field
   */
  required: boolean | undefined

  /**
   * The selected items
   */
  selectedItems: T[]

  /**
   * Function to select a value
   */
  selectValue: (value: string) => void

  /**
   * The value of the combobox input
   */
  setHighlightValue: (value: string) => void

  /**
   * Function to set the input value of the combobox
   */
  setInputValue: (
    value: string,
    reason?: ComboboxInputValueChangeReason,
  ) => void

  /**
   * Function to open or close the combobox
   */
  setOpen: (open: boolean, reason?: ComboboxOpenChangeReason) => void

  /**
   * Function to set the function to scroll to a specific index. Can be used instead
   * of the scrollToIndexFn prop.
   */
  setScrollToIndexFn(fn: (details: ComboboxScrollToIndexDetails) => void): void

  /**
   * Function to set the value of the combobox
   */
  setValue: (value: string[]) => void

  /**
   * Function to sync the selected items with the value.
   * Useful when `value` is updated from async sources.
   */
  syncSelectedItems: () => void

  /**
   * The selected item keys
   */
  value: string[]

  /**
   * The string representation of the selected items
   */
  valueAsString: string

  // group: getters
  getClearTriggerBindings: (
    params: IdRegistrationProps,
  ) => ComboboxClearTriggerBindings
  getContentBindings: (params: IdRegistrationProps) => ComboboxContentBindings
  getControlBindings: (params: IdRegistrationProps) => ComboboxControlBindings
  getEmptyBindings: () => ComboboxEmptyBindings
  getErrorIndicatorBindings: () => ComboboxErrorIndicatorBindings
  getErrorTextBindings: (
    params: IdRegistrationProps,
  ) => ComboboxErrorTextBindings
  getHintBindings: (params: IdRegistrationProps) => ComboboxHintBindings
  getInputBindings: (params: IdRegistrationProps) => ComboboxInputBindings
  getItemBindings: (props: ComboboxItemContext) => ComboboxItemBindings
  getItemGroupBindings: (
    props: ComboboxApiItemGroupProps,
  ) => ComboboxItemGroupBindings
  getItemGroupLabelBindings: (
    props: ComboboxApiItemGroupLabelProps,
  ) => ComboboxItemGroupLabelBindings
  getItemIndicatorBindings: (
    props: ComboboxItemContext,
  ) => ComboboxItemIndicatorBindings
  getItemTextBindings: (props: ComboboxItemContext) => ComboboxItemTextBindings
  getLabelBindings: (params: IdRegistrationProps) => ComboboxLabelBindings
  getPositionerBindings: (
    params: IdRegistrationProps,
  ) => ComboboxPositionerBindings
  getRootBindings: (params: IdRegistrationProps) => ComboboxRootBindings
  getTriggerBindings: (
    params: IdRegistrationProps & ComboboxApiTriggerProps,
  ) => ComboboxTriggerBindings
}

type PartName = AnatomyPartName<typeof comboboxAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"combobox", P> {}

export interface ComboboxRootBindings extends Part<"root"> {
  "data-invalid": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  dir: Direction
  id: string
  onClick: JSX.MouseEventHandler
}

export interface ComboboxClearTriggerBindings extends Part<"clearTrigger"> {
  "aria-controls": string
  "aria-label": string | undefined
  "data-invalid": BooleanDataAttr
  disabled: boolean | undefined
  hidden: boolean
  id: string
  onClick: JSX.MouseEventHandler
  onPointerDown: JSX.PointerEventHandler
  tabIndex: -1
  type: "button"
}

export interface ComboboxContentBindings extends Part<"content"> {
  "aria-labelledby": string | undefined
  "aria-multiselectable": "true" | undefined
  "data-disabled": BooleanDataAttr
  "data-empty": BooleanDataAttr
  "data-focus-visible": BooleanDataAttr
  "data-placement": Placement | undefined
  "data-state": "open" | "closed"
  hidden: boolean
  id: string
  onPointerDown: JSX.PointerEventHandler
  role: "dialog" | "listbox"
  tabIndex: -1
}

export interface ComboboxControlBindings extends Part<"control"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-state": "open" | "closed"
  id: string
}

export interface ComboboxEmptyBindings extends Part<"empty"> {
  hidden: boolean
  role: "presentation"
}

export interface ComboboxInputBindings extends Part<"input"> {
  "aria-activedescendant": string | undefined
  "aria-autocomplete": "both" | "list"
  "aria-controls": string
  "aria-expanded": BooleanAriaAttr
  "aria-invalid": BooleanAriaAttr
  autoCapitalize: "none"
  autoComplete: "off"
  autoCorrect: "off"
  "data-autofocus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-state": "open" | "closed"
  defaultValue: string
  disabled: boolean | undefined
  form: string | undefined
  id: string
  name: string | undefined
  onBlur: JSX.FocusEventHandler<HTMLInputElement>
  onChange: JSX.ChangeEventHandler<HTMLInputElement>
  onClick: JSX.MouseEventHandler<HTMLInputElement>
  onFocus: JSX.FocusEventHandler<HTMLInputElement>
  onKeyDown: JSX.KeyboardEventHandler<HTMLInputElement>
  placeholder: string | undefined
  readOnly: boolean | undefined
  required: boolean | undefined
  role: "combobox"
  spellCheck: "false"
  type: "text"
}

export interface ComboboxItemBindings extends Part<"item"> {
  "aria-disabled": BooleanAriaAttr
  "aria-selected": BooleanAriaAttr
  "data-disabled": BooleanDataAttr
  "data-highlighted": BooleanDataAttr
  "data-state": "checked" | "unchecked"
  "data-value": string
  id: string
  onClick: JSX.MouseEventHandler
  onPointerLeave: JSX.PointerEventHandler
  onPointerMove: JSX.PointerEventHandler
  role: "option"
  tabIndex: -1
}

export interface ComboboxItemGroupBindings extends Part<"itemGroup"> {
  "aria-labelledby": string
  "data-empty": BooleanDataAttr
  id: string
  role: "group"
}

export interface ComboboxItemGroupLabelBindings extends Part<"itemGroupLabel"> {
  id: string
  role: "presentation"
}

export interface ComboboxItemIndicatorBindings extends Part<"itemIndicator"> {
  "aria-hidden": true
  "data-state": "checked" | "unchecked"
  hidden: boolean
}

export interface ComboboxItemTextBindings extends Part<"itemText"> {
  "data-disabled": BooleanDataAttr
  "data-highlighted": BooleanDataAttr
  "data-state": "checked" | "unchecked"
}

export interface ComboboxLabelBindings extends Part<"label"> {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  "data-required": BooleanDataAttr
  htmlFor: string
  id: string
  onClick: JSX.MouseEventHandler
}

export interface ComboboxHintBindings extends Part<"hint"> {
  "data-disabled": BooleanDataAttr
  hidden: boolean
  id: string
}

export interface ComboboxErrorTextBindings extends Part<"errorText"> {
  "aria-live": "polite"
  hidden: boolean
  id: string
}

export interface ComboboxErrorIndicatorBindings extends Part<"errorIndicator"> {
  "aria-label": "Error"
  hidden: boolean
}

export interface ComboboxPositionerBindings extends Part<"positioner"> {
  id: string
  style: JSX.CSSProperties
}

export interface ComboboxTriggerBindings extends Part<"trigger"> {
  "aria-controls": string | undefined
  "aria-expanded": BooleanAriaAttr
  "aria-haspopup": "listbox" | "dialog"
  "aria-label": string | undefined
  "data-disabled": BooleanDataAttr
  "data-focusable": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  "data-state": "open" | "closed"
  disabled: boolean | undefined
  id: string
  onClick: JSX.MouseEventHandler
  onFocus: JSX.FocusEventHandler
  onKeyDown: JSX.KeyboardEventHandler
  onPointerDown: JSX.PointerEventHandler
  tabIndex: -1 | undefined
  type: "button"
}
