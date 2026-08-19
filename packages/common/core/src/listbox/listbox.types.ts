/* -----------------------------------------------------------------------------
 * Callback details
 * ----------------------------------------------------------------------------- */

import type {TypeaheadState} from "@qualcomm-ui/dom/query"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {
  CollectionItem,
  ListCollection,
  ListSelection,
  SelectionMode,
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

import type {listboxAnatomy} from "./listbox.anatomy.js"

export interface ListboxValueChangeDetails<
  T extends CollectionItem = CollectionItem,
> {
  items: T[]
  value: string[]
}

export interface ListboxHighlightChangeDetails<
  T extends CollectionItem = CollectionItem,
> {
  highlightedIndex: number
  highlightedItem: T | null
  highlightedValue: string | null
}

export interface ListboxScrollToIndexDetails {
  getElement: () => HTMLElement | null
  immediate?: boolean | undefined
  index: number
}

export interface ListboxSelectionDetails {
  value: string
}

export interface ListboxApiProps<T extends CollectionItem = CollectionItem>
  extends DirectionProperty, CommonProperties {
  /**
   * The item collection
   *
   * @inheritDoc
   */
  collection: ListCollection<T>

  /**
   * The initial value of the highlighted item when opened.
   * Use when you don't need to control the highlighted value of the listbox.
   */
  defaultHighlightedValue?: string | null | undefined

  /**
   * The initial default value of the listbox when rendered.
   * Use when you don't need to control the value of the listbox.
   *
   * @default []
   */
  defaultValue?: string[] | undefined

  /**
   * Whether to disallow empty selection
   */
  deselectable?: boolean | undefined

  /**
   * Whether the listbox is disabled
   */
  disabled?: boolean | undefined

  /**
   * Whether to disallow selecting all items when `meta+a` is pressed
   */
  disallowSelectAll?: boolean | undefined

  /**
   * The controlled key of the highlighted item
   */
  highlightedValue?: string | null | undefined

  /**
   * Whether to loop the keyboard navigation through the options
   * @default false
   */
  loopFocus?: boolean | undefined

  /**
   * The callback fired when the highlighted item changes.
   */
  onHighlightChange?:
    | ((details: ListboxHighlightChangeDetails<T>) => void)
    | undefined

  /**
   * Function called when an item is selected
   */
  onSelect?: ((details: ListboxSelectionDetails) => void) | undefined

  /**
   * The callback fired when the selected item changes.
   */
  onValueChange?: ((details: ListboxValueChangeDetails<T>) => void) | undefined

  /**
   * The orientation of the listbox.
   * @default "vertical"
   */
  orientation?: "horizontal" | "vertical" | undefined

  /**
   * Function to scroll to a specific index
   */
  scrollToIndexFn?: ((details: ListboxScrollToIndexDetails) => void) | undefined

  /**
   * How multiple selection should behave in the listbox.
   *
   * - `single`: The user can select a single item.
   * - `multiple`: The user can select multiple items without using modifier keys.
   * - `extended`: The user can select multiple items by using modifier keys.
   *
   * @default "single"
   */
  selectionMode?: SelectionMode | undefined

  /**
   * Whether to select the item when it is highlighted
   */
  selectOnHighlight?: boolean | undefined

  /**
   * Whether to enable typeahead on the listbox
   */
  typeahead?: boolean | undefined

  /**
   * The controlled keys of the selected items
   */
  value?: string[] | undefined
}

export interface ListboxElementIds {
  content: string
  item: string[]
  itemGroup: string[]
  itemGroupLabel: string[]
  label: string
  root: string
}

export interface ListboxScope extends ScopeWithIds<ListboxSchema> {}

type PropsWithDefault = "collection" | "dir" | "selectionMode"

export interface ListboxSchema<T extends CollectionItem = CollectionItem> {
  actions: ActionSchema<
    | "clearFocused"
    | "clearHighlightedItem"
    | "clearInputState"
    | "clearItem"
    | "clearSelectedItems"
    | "highlightFirstValue"
    | "highlightLastValue"
    | "highlightMatchingItem"
    | "highlightNextValue"
    | "highlightPreviousValue"
    | "selectHighlightedItem"
    | "selectItem"
    | "selectWithKeyboard"
    | "setDefaultHighlightedValue"
    | "setFocused"
    | "setHighlightedItem"
    | "setInputState"
    | "setSelectedItems"
    | "syncHighlightedItem"
    | "syncHighlightedValue"
    | "syncSelectedItems"
  >
  computed: {
    hasSelectedItems: boolean
    isInteractive: boolean
    isTypingAhead: boolean
    multiple: boolean
    selectedItems: T[]
    selection: ListSelection
    valueAsString: string
  }
  context: {
    focused: boolean
    highlightedItem: T | null
    highlightedValue: string | null
    selectedItemMap: Map<string, T>
    value: string[]
  }
  effects: EffectSchema<"scrollToHighlightedItem" | "trackFocusVisible">
  events:
    | {
        type:
          | "CONTENT.BLUR"
          | "CONTENT.FOCUS"
          | "HIGHLIGHT.FIRST"
          | "HIGHLIGHT.LAST"
          | "HIGHLIGHT.NEXT"
          | "HIGHLIGHT.PREV"
      }
    | {
        type: "HIGHLIGHTED_VALUE.SET"
        value: string | null
      }
    | {
        type: "VALUE.SET"
        value: string[]
      }
    | {
        type: "ITEM.CLEAR"
        value: string | undefined
      }
    | {type: "VALUE.CLEAR"}
    | {
        type: "ITEM.SELECT"
        value: string
      }
    | {
        anchorValue: string | null
        shiftKey: boolean
        type: "NAVIGATE"
        value: string | null
      }
    | {
        anchorValue?: string | null
        metaKey?: boolean | undefined
        shiftKey?: boolean | undefined
        type: "ITEM.CLICK"
        value: string | null
      }
    | {
        key: string
        type: "CONTENT.TYPEAHEAD"
      }
    | {
        src: string
        type: "CONTENT.BLUR"
      }
    | {
        autoHighlight: boolean | undefined
        type: "INPUT.FOCUS"
      }
  guards: GuardSchema<"hasHighlightedValue" | "hasSelectedValue">
  ids: ListboxElementIds
  props: RequiredBy<ListboxApiProps<T>, PropsWithDefault>
  refs: {
    focusVisible: boolean
    inputState: {autoHighlight: boolean; focused: boolean}
    typeahead: TypeaheadState
  }
  state: "idle"
}

/* -----------------------------------------------------------------------------
 * Component API
 * ----------------------------------------------------------------------------- */

export interface ListboxItemApiProps<
  T extends CollectionItem = CollectionItem,
> {
  /**
   * The item to render
   */
  item: T
}

export interface ListboxItemState {
  /**
   * Whether the item is disabled
   */
  disabled: boolean

  /**
   * Whether the item is focused
   */
  focused: boolean

  /**
   * Whether the item is focus visible
   */
  focusVisible: boolean

  /**
   * Whether the item is highlighted
   */
  highlighted: boolean

  /**
   * Whether the item is selected
   */
  selected: boolean

  /**
   * The underlying value of the item
   */
  value: string
}

export interface ListboxItemGroupApiProps {
  id: string
}

export interface ListboxItemGroupLabelApiProps {
  /**
   * The id of the item group element that is described by this label
   */
  groupId: string
}

export interface ListboxInputApiProps {
  /**
   * Whether to automatically highlight the item when typing
   * @default false
   */
  autoHighlight?: boolean | undefined

  /**
   * Determines how keyboard conflicts in the input are resolved.
   * - "caret": keep native text-editing behavior
   * - "navigate": forward supported keys to listbox navigation
   * @default "caret"
   */
  keyboardPriority?: "caret" | "navigate" | undefined
}

type PartName = AnatomyPartName<typeof listboxAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"listbox", P> {}

type ListboxLayout = "grid" | "list"

export interface ListboxRootBindings extends Part<"root"> {
  "data-disabled": BooleanDataAttr
  "data-orientation": ListboxApiProps["orientation"]
  dir: Direction
  id: string
}

export interface ListboxContentBindings extends Part<"content"> {
  "aria-activedescendant": string | undefined
  "aria-labelledby": string
  "aria-multiselectable": true | undefined
  "data-activedescendant": string | undefined
  "data-empty": BooleanDataAttr
  "data-layout": ListboxLayout
  "data-orientation": ListboxApiProps["orientation"]
  dir: Direction
  id: string
  onBlur: JSX.FocusEventHandler<HTMLElement>
  onFocus: JSX.FocusEventHandler<HTMLElement>
  onKeyDown: JSX.KeyboardEventHandler<HTMLElement>
  role: "listbox"
  style: JSX.CSSProperties
  tabIndex: 0
}

export interface ListboxInputBindings extends Part<"input"> {
  "aria-activedescendant": string | undefined
  "aria-autocomplete": "list"
  "aria-controls": string
  "aria-haspopup": "listbox"
  autoComplete: "off"
  autoCorrect: "off"
  "data-disabled": BooleanDataAttr
  dir: Direction
  disabled: boolean | undefined
  enterKeyHint: "go"
  onBlur: JSX.FocusEventHandler
  onFocus: JSX.FocusEventHandler
  onInput: JSX.FormEventHandler
  onKeyDown: JSX.KeyboardEventHandler
  spellCheck: false
}

export interface ListboxItemBindings extends Part<"item"> {
  "aria-disabled": BooleanAriaAttr
  "aria-selected": boolean
  "data-disabled": BooleanDataAttr
  "data-highlighted": BooleanDataAttr
  "data-layout": ListboxLayout
  "data-orientation": ListboxApiProps["orientation"]
  "data-selected": BooleanDataAttr
  "data-state": "checked" | "unchecked"
  "data-value": string
  dir: Direction
  id: string
  onClick: JSX.MouseEventHandler<HTMLElement>
  onMouseDown: JSX.MouseEventHandler<HTMLElement>
  role: "option"
}

export interface ListboxItemLabelBindings extends Part<"itemText"> {
  "data-disabled": BooleanDataAttr
  "data-highlighted": BooleanDataAttr
  "data-state": "checked" | "unchecked"
  dir: Direction
}

export interface ListboxItemGroupBindings extends Part<"itemGroup"> {
  "aria-labelledby": string | undefined
  "data-disabled": BooleanDataAttr
  "data-empty": BooleanDataAttr
  "data-orientation": ListboxApiProps["orientation"]
  dir: Direction
  id: string
  role: "group"
}

export interface ListboxItemGroupLabelBindings extends Part<"itemGroupLabel"> {
  dir: Direction
  id: string
  role: "presentation"
}

export interface ListboxItemIndicatorBindings extends Part<"itemIndicator"> {
  "aria-hidden": true
  "data-state": "checked" | "unchecked"
  dir: Direction
  hidden: boolean | undefined
}

export interface ListboxLabelBindings extends Part<"label"> {
  "data-disabled": BooleanDataAttr
  dir: Direction
  id: string
}

export interface ListboxApi<V extends CollectionItem = CollectionItem> {
  /**
   * Function to clear the highlighted value
   */
  clearHighlightedValue: VoidFunction

  /**
   * Function to clear the value of the listbox.
   * If a value is provided, it will only clear that value, otherwise, it will clear
   * all values.
   */
  clearValue: (value?: string) => void

  /**
   * Function to toggle the select
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
   * Returns the state of a select item
   */
  getItemState: (props: ListboxItemApiProps) => ListboxItemState

  /**
   * Whether there's a selected option
   */
  hasSelectedItems: boolean

  /**
   * The highlighted item
   */
  highlightedItem: V | null

  /**
   * The value of the highlighted item
   */
  highlightedValue: string | null

  /**
   * Function to highlight the first value
   */
  highlightFirst: VoidFunction

  /**
   * Function to highlight the last value
   */
  highlightLast: VoidFunction

  /**
   * Function to highlight the next value
   */
  highlightNext: VoidFunction

  /**
   * Function to highlight the previous value
   */
  highlightPrevious: VoidFunction

  /**
   * Function to highlight a value
   */
  highlightValue: (value: string) => void

  /**
   * Function to select all values.
   *
   * **Note**: This should only be called when the selectionMode is `multiple` or
   * `extended`. Otherwise, an exception will be thrown.
   */
  selectAll: VoidFunction

  /**
   * The selected items
   */
  selectedItems: V[]

  /**
   * Function to select a value
   */
  selectValue: (value: string) => void

  /**
   * Function to set the value of the select
   */
  setValue: (value: string[]) => void

  /**
   * The selected item keys
   */
  value: string[]

  /**
   * The string representation of the selected items
   */
  valueAsString: string

  // group: bindings
  getContentBindings: (props: IdRegistrationProps) => ListboxContentBindings
  getInputBindings: (props: ListboxInputApiProps) => ListboxInputBindings
  getItemBindings: (
    props: ListboxItemApiProps & IdRegistrationProps,
  ) => ListboxItemBindings
  getItemGroupBindings: (props: IdRegistrationProps) => ListboxItemGroupBindings
  getItemGroupLabelBindings: (
    props: IdRegistrationProps & ListboxItemGroupLabelApiProps,
  ) => ListboxItemGroupLabelBindings
  getItemIndicatorBindings: (
    props: ListboxItemApiProps,
  ) => ListboxItemIndicatorBindings
  getItemLabelBindings: (props: ListboxItemApiProps) => ListboxItemLabelBindings
  getLabelBindings: (props: IdRegistrationProps) => ListboxLabelBindings
  getRootBindings: (props: IdRegistrationProps) => ListboxRootBindings
}
