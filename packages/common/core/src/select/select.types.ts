// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  InputErrorIndicatorBindings,
  InputErrorTextBindings,
  InputHintBindings,
} from "@qualcomm-ui/core/input"
import type {Placement, PositioningOptions} from "@qualcomm-ui/dom/floating-ui"
import type {InteractOutsideHandlers} from "@qualcomm-ui/dom/interact-outside"
import type {TypeaheadState} from "@qualcomm-ui/dom/query"
import type {BooleanAriaAttr, BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {CollectionItem, ListCollection} from "@qualcomm-ui/utils/collection"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
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

export interface SelectValueChangeDetails<
  T extends CollectionItem = CollectionItem,
> {
  items: T[]
}

export interface HighlightChangeDetails<
  T extends CollectionItem = CollectionItem,
> {
  highlightedIndex: number
  highlightedItem: T | null
}

export interface ItemProps<T extends CollectionItem = CollectionItem> {
  /**
   * The item to render
   */
  item: T

  /**
   * Whether hovering outside should clear the highlighted state
   */
  persistFocus?: boolean | undefined
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
   * Whether hovering outside should clear the highlighted state
   */
  persistFocus?: boolean | undefined

  /**
   * Whether the item is selected
   */
  selected: boolean

  /**
   * The underlying value of the item
   */
  value: string
}

export interface ItemGroupProps {
  id: string
}

export interface ItemGroupLabelProps {
  htmlFor: string
}

export interface ScrollToIndexDetails {
  /**
   * Whether to scroll as soon as the function is fired.
   */
  immediate?: boolean | undefined

  /**
   * The item index to scroll to.
   */
  index: number
}

export type ScrollToIndexFn = (details: ScrollToIndexDetails) => void

export interface SelectElementIds {
  clearTrigger: string
  content: string
  control: string
  errorText: string
  hiddenSelect: string
  hint: string
  item(id: string | number): string
  itemGroup(id: string | number): string
  itemGroupLabel(id: string | number): string
  label: string
  positioner: string
  root: string
}

export interface SelectScope extends ScopeWithIds<SelectSchema> {}

export interface SelectPositioningOptions extends PositioningOptions {
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
   * @default true
   */
  sameWidth?: boolean | undefined
}

export interface SelectApiProps<T extends CollectionItem = CollectionItem>
  extends DirectionProperty,
    CommonProperties,
    InteractOutsideHandlers {
  /**
   * Whether the select should close after an item is selected
   *
   * @default true
   */
  closeOnSelect?: boolean | undefined

  /**
   * The item collection
   *
   * @inheritDoc
   */
  collection: ListCollection<T>

  /**
   * The initial value of the highlighted item when opened.
   * Use when you don't need to control the highlighted value of the select.
   */
  defaultHighlightedValue?: string | null | undefined

  /**
   * Whether the select's open state is controlled by the user
   */
  defaultOpen?: boolean | undefined

  /**
   * The initial default value of the select when rendered.
   * Use when you don't need to control the value of the select.
   */
  defaultValue?: string[] | undefined

  /**
   * Whether the value can be cleared by clicking the selected item.
   *
   * This is only applicable for single selection.
   */
  deselectable?: boolean | undefined

  /**
   * Whether the select is disabled
   */
  disabled?: boolean | undefined

  /**
   * The associate form of the underlying select.
   */
  form?: string | undefined

  /**
   * The controlled key of the highlighted item
   */
  highlightedValue?: string | null

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be automatically generated for accessibility.
   */
  id?: string

  /**
   * The ids of the elements that are associated with the select. These will be
   * automatically generated if omitted.
   */
  ids?:
    | Partial<Omit<SelectElementIds, "item" | "itemGroup" | "itemGroupLabel">>
    | undefined

  /**
   * Whether the select is invalid
   */
  invalid?: boolean | undefined

  /**
   * Whether to loop the keyboard navigation through the options
   *
   * @default false
   */
  loopFocus?: boolean | undefined

  /**
   * Whether to allow multiple selection
   *
   * @default false
   */
  multiple?: boolean | undefined

  /**
   * The `name` attribute of the underlying select.
   */
  name?: string | undefined

  /**
   * The callback fired when the highlighted item changes.
   */
  onHighlightChange?:
    | ((value: string | null, details: HighlightChangeDetails<T>) => void)
    | undefined

  /**
   * Function invoked when the popup opens or closes
   */
  onOpenChange?: (
    /**
     * The next value of the open state.
     */
    open: boolean,
  ) => void

  /**
   * Function called when an item is selected
   */
  onSelect?: ((value: string) => void) | undefined

  /**
   * The callback fired when the selected item changes.
   */
  onValueChange?:
    | ((valueStrings: string[], details: SelectValueChangeDetails<T>) => void)
    | undefined

  /**
   * Whether the select menu is open
   */
  open?: boolean | undefined

  /**
   * Placeholder text to display when no value is selected.
   *
   * @default "Select an option"
   */
  placeholder?: string | undefined

  /**
   * The positioning options of the menu.
   *
   * @inheritDoc
   */
  positioning?: SelectPositioningOptions | undefined

  /**
   * Whether the select is read-only
   */
  readOnly?: boolean | undefined

  /**
   * Whether the select is required
   */
  required?: boolean | undefined

  /**
   * Function to scroll to a specific index
   */
  scrollToIndexFn?: ScrollToIndexFn

  /**
   * The controlled keys of the selected items
   */
  value?: string[] | undefined
}

export interface SelectValueTextOptions {
  /**
   * Placeholder text to display when no value is selected.
   *
   * @default "Select option"
   */
  placeholder?: string
}

interface Context<T extends CollectionItem = CollectionItem> {
  currentPlacement: Placement | undefined
  fieldsetDisabled: boolean
  highlightedItem: T | null
  highlightedValue: string | null
  selectedItems: T[]
  value: string[]
  valueAsString: string
}

interface RestoreFocusEvent {
  previousEvent?: {restoreFocus?: boolean | undefined}
  restoreFocus?: boolean | undefined
}

export interface SelectSchema<T extends CollectionItem = CollectionItem> {
  actions: ActionSchema<
    | "clearHighlightedItem"
    | "clearItem"
    | "clearSelectedItems"
    | "dispatchChangeEvent"
    | "focusTriggerEl"
    | "highlightComputedFirstItem"
    | "highlightComputedLastItem"
    | "highlightFirstItem"
    | "highlightFirstSelectedItem"
    | "highlightItem"
    | "highlightLastItem"
    | "highlightMatchingItem"
    | "highlightNextItem"
    | "highlightPreviousItem"
    | "invokeOnClose"
    | "invokeOnOpen"
    | "reposition"
    | "scrollContentToTop"
    | "selectFirstItem"
    | "selectHighlightedItem"
    | "selectItem"
    | "selectLastItem"
    | "selectMatchingItem"
    | "selectPreviousItem"
    | "setHighlightedItem"
    | "setInitialFocus"
    | "setSelectedItems"
    | "syncCollection"
    | "syncHighlightedItem"
    | "syncSelectedItems"
    | "syncSelectElement"
    | "toggleVisibility"
  >
  computed: {
    hasSelectedItems: boolean
    hiddenSelectOptions: HiddenSelectOption[]
    isDisabled: boolean
    isEmpty: boolean
    isInteractive: boolean
    isTypingAhead: boolean
  }
  context: Context<T>
  effects: EffectSchema<
    | "computePlacement"
    | "scrollToHighlightedItem"
    | "trackDismissableElement"
    | "trackFormControlState"
    | "trackFocusVisible"
  >
  events:
    | {
        type:
          | "OPEN"
          | "ITEM.POINTER_LEAVE"
          | "CONTENT.ARROW_DOWN"
          | "CONTENT.ARROW_UP"
          | "CONTENT.END"
          | "CONTENT.HOME"
          | "TRIGGER.ARROW_DOWN"
          | "TRIGGER.ARROW_LEFT"
          | "TRIGGER.ARROW_RIGHT"
          | "TRIGGER.ARROW_UP"
          | "TRIGGER.BLUR"
          | "TRIGGER.CLICK"
          | "TRIGGER.END"
          | "TRIGGER.ENTER"
          | "TRIGGER.FOCUS"
          | "TRIGGER.HOME"
          | "TRIGGER.TAB"
          | "VALUE.CLEAR"
      }
    | ({
        type: "CLEAR.CLICK"
      } & RestoreFocusEvent)
    | ({src?: string; type: "CLOSE"} & RestoreFocusEvent)
    | {key: string; type: "CONTENT.TYPEAHEAD"}
    | ({src?: string; type: "CONTROLLED.CLOSE"} & RestoreFocusEvent)
    | {restoreFocus?: boolean; type: "CONTROLLED.OPEN"}
    | {type: "HIGHLIGHTED_VALUE.SET"; value: string | null}
    | {type: "ITEM.CLEAR"; value: string}
    | {src?: string; type: "ITEM.CLICK"; value?: string | null}
    | {type: "ITEM.POINTER_MOVE"; value?: string | null}
    | {type: "ITEM.SELECT"; value: string}
    | {options: Partial<PositioningOptions>; type: "POSITIONING.SET"}
    | {type: "TRIGGER.TYPEAHEAD"; value: string}
    | {type: "VALUE.SET"; value: string[]}
  guards: GuardSchema<
    | "canHighlightNextItem"
    | "canHighlightPreviousItem"
    | "closeOnSelect"
    | "hasHighlightedItem"
    | "hasSelectedItems"
    | "isFirstItemHighlighted"
    | "isLastItemHighlighted"
    | "isOpenControlled"
    | "isTriggerArrowDownEvent"
    | "isTriggerArrowUpEvent"
    | "isTriggerClickEvent"
    | "isTriggerEnterEvent"
    | "loop"
    | "multiple"
    | "restoreFocus"
  >
  ids: SelectElementIds
  props: RequiredBy<
    SelectApiProps<T>,
    | "closeOnSelect"
    | "collection"
    | "dir"
    | "loopFocus"
    | "placeholder"
    | "multiple"
    | "positioning"
  >
  refs: {
    scrollToIndexFn: ScrollToIndexFn | undefined
    typeahead: TypeaheadState
  }
  state: "idle" | "focused" | "open"
}

interface CommonBindings extends DirectionProperty {
  "data-scope": "select"
}

export interface SelectRootBindings extends CommonBindings {
  "data-invalid": BooleanDataAttr
  "data-part": "root"
  "data-readonly": BooleanDataAttr
  id: string
}

export interface SelectHintBindings extends CommonBindings, InputHintBindings {}

export interface SelectErrorTextBindings
  extends CommonBindings,
    InputErrorTextBindings {}

export interface SelectErrorIndicatorBindings
  extends CommonBindings,
    InputErrorIndicatorBindings {}

export interface SelectLabelBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "label"
  "data-readonly": BooleanDataAttr
  htmlFor: string
  id: string
  onClick: JSX.MouseEventHandler<HTMLLabelElement>
}

export interface SelectValueTextBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-multiple": BooleanDataAttr
  "data-part": "value-text"
}

export interface SelectControlBindings extends CommonBindings {
  "aria-controls": string
  "aria-expanded": BooleanAriaAttr
  "aria-haspopup": "listbox"
  "aria-invalid": boolean | undefined
  "aria-labelledby": string
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "control"
  "data-placeholder-shown": BooleanDataAttr
  "data-placement": Placement | undefined
  "data-readonly": BooleanDataAttr
  "data-state": "open" | "closed"
  disabled: boolean
  id: string
  onBlur: JSX.FocusEventHandler<HTMLElement>
  onClick: JSX.MouseEventHandler<HTMLElement>
  onFocus: JSX.FocusEventHandler<HTMLElement>
  onKeyDown: JSX.KeyboardEventHandler<HTMLElement>
  role: "combobox"
  tabIndex: number
}

/*
 * This is the "Trigger" in Ark/Zag
 */
export interface SelectIndicatorBindings extends CommonBindings {
  "aria-hidden": true
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "indicator"
  "data-readonly": BooleanDataAttr
  "data-state": "open" | "closed"
}

export interface SelectItemBindings extends CommonBindings {
  "aria-disabled": BooleanAriaAttr
  "aria-selected": boolean
  "data-disabled": BooleanDataAttr
  "data-highlighted": BooleanDataAttr
  "data-part": "item"
  "data-state": "checked" | "unchecked"
  "data-value": string
  id: string
  onClick: JSX.MouseEventHandler<HTMLElement>
  onPointerLeave: JSX.PointerEventHandler<HTMLElement>
  onPointerMove: JSX.PointerEventHandler<HTMLElement>
  role: "option"
}

export interface SelectItemTextBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-highlighted": BooleanDataAttr
  "data-part": "item-text"
  "data-state": "checked" | "unchecked"
}

export interface SelectItemIndicatorBindings extends CommonBindings {
  "aria-hidden": true
  "data-part": "item-indicator"
  "data-state": "checked" | "unchecked"
  hidden: boolean
}

export interface SelectItemGroupLabelBindings extends CommonBindings {
  "data-part": "item-group-label"
  id: string
  role: "presentation"
}

export interface SelectItemGroupBindings extends CommonBindings {
  "aria-labelledby": string
  "data-disabled": BooleanDataAttr
  "data-part": "item-group"
  id: string
  role: "group"
}

export interface SelectClearTriggerBindings extends CommonBindings {
  "aria-label": "Clear value"
  "data-invalid": BooleanDataAttr
  "data-part": "clear-trigger"
  disabled: boolean
  hidden: boolean
  id: string
  onClick: JSX.MouseEventHandler<HTMLButtonElement>
  type: "button"
}

export interface SelectHiddenSelectBindings extends CommonBindings {
  "aria-hidden": true
  "aria-labelledby": string
  "data-part": "hidden-select"
  defaultValue: string | string[]
  disabled: boolean
  form: string | undefined
  id: string
  multiple: boolean
  name: string | undefined
  onFocus: JSX.FocusEventHandler<HTMLSelectElement>
  required: boolean
  style: JSX.CSSProperties
  tabIndex: -1
}

export interface SelectPositionerBindings extends CommonBindings {
  "data-part": "positioner"
  id: string
  style: JSX.CSSProperties
}

export interface SelectContentBindings extends CommonBindings {
  "aria-activedescendant": string | undefined
  "aria-labelledby": string
  "aria-multiselectable": BooleanAriaAttr
  "data-activedescendant": string | undefined
  "data-focus-visible": BooleanDataAttr
  "data-part": "content"
  "data-placement": Placement | undefined
  "data-state": "open" | "closed"
  hidden: boolean
  id: string
  onKeyDown: JSX.KeyboardEventHandler<HTMLElement>
  role: "listbox" | "dialog"
  tabIndex: 0
}

export interface HiddenSelectOption {
  disabled: boolean
  label: string
  value: string
}

export interface SelectApi<V extends CollectionItem = CollectionItem> {
  /**
   * Function to clear the value of the select.
   * If a value is provided, it will only clear that value, otherwise, it will clear
   * all values.
   */
  clearValue(value: string): void

  /**
   * The item collection
   */
  collection: ListCollection<V>

  /**
   * Whether the select is disabled
   */
  disabled: boolean

  /**
   * Whether the select value is empty
   */
  empty: boolean

  /**
   * Function to focus on the select input
   */
  focus(): void

  /**
   * Whether the select is focused
   */
  focused: boolean

  /**
   * Whether there's a selected option
   */
  hasSelectedItems: boolean

  /**
   * options for the hidden select element.
   */
  hiddenSelectOptions: HiddenSelectOption[]

  /**
   * The highlighted item
   */
  highlightedItem: V | null

  /**
   * The value of the highlighted item
   */
  highlightedValue: string | null

  /**
   * Function to highlight a value
   */
  highlightValue(value: string): void

  /**
   * Whether the select allows multiple selections
   */
  multiple: boolean

  /**
   * Whether the select is open
   */
  open: boolean

  /**
   * Placeholder text to display when no value is selected.
   */
  placeholder: string

  /**
   * Function to set the positioning options of the select
   */
  reposition(options?: Partial<PositioningOptions>): void

  /**
   * Whether the select is a required control within a form
   */
  required: boolean | undefined

  /**
   * Function to select all values
   */
  selectAll(): void

  /**
   * The selected items
   */
  selectedItems: V[]

  /**
   * Function to select a value
   */
  selectValue(value: string): void

  /**
   * Function to open or close the select
   */
  setOpen(open: boolean): void

  /**
   * Function to set the function to scroll to a specific index. Can be used instead
   * of the scrollToIndexFn prop.
   */
  setScrollToIndexFn(fn: ScrollToIndexFn): void

  /**
   * Function to set the value of the select
   */
  setValue(value: string[]): void

  /**
   * The selected item keys
   */
  value: string[]

  /**
   * The concatenated, string representation of the selected items
   */
  valueAsString: string

  // group: bindings
  getClearTriggerBindings(
    props: IdRegistrationProps,
  ): SelectClearTriggerBindings
  getContentBindings(props: IdRegistrationProps): SelectContentBindings
  getControlBindings(props: IdRegistrationProps): SelectControlBindings
  getErrorIndicatorBindings(): SelectErrorIndicatorBindings
  getErrorTextBindings(props: IdRegistrationProps): SelectErrorTextBindings
  getHiddenSelectBindings(
    props: IdRegistrationProps,
  ): SelectHiddenSelectBindings
  getHintBindings(props: IdRegistrationProps): SelectHintBindings
  getIndicatorBindings(): SelectIndicatorBindings
  getItemBindings(props: ItemState): SelectItemBindings
  getItemGroupBindings(props: ItemGroupProps): SelectItemGroupBindings
  getItemGroupLabelBindings(
    props: ItemGroupLabelProps,
  ): SelectItemGroupLabelBindings
  getItemIndicatorBindings(props: ItemState): SelectItemIndicatorBindings
  getItemState(props: ItemProps): ItemState
  getItemTextBindings(props: ItemState): SelectItemTextBindings
  getLabelBindings(props: IdRegistrationProps): SelectLabelBindings
  getPositionerBindings(props: IdRegistrationProps): SelectPositionerBindings
  getRootBindings(props: IdRegistrationProps): SelectRootBindings
  getValueTextBindings(): SelectValueTextBindings
}
