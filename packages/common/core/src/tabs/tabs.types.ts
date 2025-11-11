// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
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
  CommonProperties,
  EffectSchema,
  GuardSchema,
  IdRegistrationProps,
  JSX,
  MachineSchema,
} from "@qualcomm-ui/utils/machine"

export interface IntlTranslations {
  listLabel?: string | undefined
}

export type TabsOrientation = "horizontal" | "vertical"

export type TabsActivationMode = "automatic" | "manual"

export interface TabsApiProps extends DirectionProperty, CommonProperties {
  /**
   * The activation mode of the tabs.
   * @option `'automatic'`: Tabs are activated when receiving focus
   * @option `'manual'`: Tabs are activated when clicked or the enter key is pressed.
   *
   * @default "automatic"
   */
  activationMode?: TabsActivationMode | undefined

  /**
   * Determines whether tabs act as a standalone composite widget (true) or as a
   * non-focusable component within another widget (false).
   *
   * @default true
   */
  composite?: boolean | undefined

  /**
   * The initial selected tab value when rendered.
   * Use when you don't need to control the selected tab value.
   */
  defaultValue?: string | null | undefined

  /**
   * Whether the active tab can be deselected when clicking on it.
   */
  deselectable?: boolean | undefined

  /**
   * Whether the keyboard navigation will loop from last tab to first, and vice versa.
   * @default true
   */
  loopFocus?: boolean | undefined

  /**
   * Callback to be called when the focused tab changes
   */
  onFocusChange?: ((value: string) => void) | undefined

  /**
   * Callback to be called when the selected/active tab changes
   */
  onValueChange?: ((value: string) => void) | undefined

  /**
   * The orientation of the tabs. Can be `horizontal` or `vertical`
   * @option `'horizontal'`: only left and right arrow key navigation will work.
   * @option `'vertical'`: only up and down arrow key navigation will work.
   *
   * @default "horizontal"
   */
  orientation?: TabsOrientation | undefined

  /**
   * Specifies the localized strings that identifies the accessibility elements and
   * their states
   */
  translations?: IntlTranslations | undefined

  /**
   * The controlled selected tab value
   */
  value?: string | null | undefined
}

type PropsWithDefault =
  | "activationMode"
  | "composite"
  | "defaultValue"
  | "dir"
  | "loopFocus"
  | "orientation"

export interface TabsElementIds {
  dismissButton: string[]
  indicator: string
  list: string
  panel: string[]
  tabButton: string[]
}

export interface TabsSchema extends MachineSchema {
  actions: ActionSchema<
    | "allowIndicatorTransition"
    | "cleanupObserver"
    | "cleanupListObserver"
    | "clearFocusedValue"
    | "clearValue"
    | "focusFirstTab"
    | "focusLastTab"
    | "focusNextTab"
    | "focusPrevTab"
    | "renderIndicator"
    | "selectFocusedTab"
    | "setFocusedValue"
    | "setIndicatorRect"
    | "setValue"
    | "syncFocusVisible"
    | "syncIndicatorRect"
    | "syncTabIndex"
  >
  context: {
    focusedValue: string | null
    focusVisible: boolean
    indicatorRect: {height: string; left: string; top: string; width: string}
    indicatorRendered: boolean
    indicatorTransition: boolean
    value: string | null
  }
  effects: EffectSchema<"trackTabListElement">
  event: any
  guards: GuardSchema<"isIndicatorRendered" | "selectOnFocus">
  ids: TabsElementIds
  props: RequiredBy<TabsApiProps, PropsWithDefault>
  refs: {
    indicatorCleanup: (() => void) | null | undefined
    listObserverCleanup: (() => void) | null | undefined
  }
  state: "idle" | "focused"
}

export interface TabProps {
  /**
   * Whether the tab is disabled
   */
  disabled?: boolean | undefined

  /**
   * The value of the tab
   */
  value: string
}

export interface TabState {
  /**
   * Whether the tab is disabled
   */
  disabled: boolean

  /**
   * Whether the tab is focused
   */
  focused: boolean

  /**
   * Whether the tab is selected
   */
  selected: boolean
}

export interface PanelProps {
  /**
   * The value of the associated tab
   */
  value: string
}

export interface TabsCommonBindings extends DirectionProperty {
  "data-scope": "tabs"
}

export interface TabsRootBindings extends TabsCommonBindings {
  "data-focus": BooleanDataAttr
  "data-orientation": TabsOrientation
  "data-part": "root"
}

export interface TabsPanelBindings extends TabsCommonBindings {
  "aria-labelledby": string
  "data-orientation": TabsOrientation
  "data-ownedby": string
  "data-part": "panel"
  "data-selected": BooleanDataAttr
  hidden: boolean
  role: "tabpanel"
  tabIndex: 0 | -1
}

export interface TabsListBindings extends TabsCommonBindings {
  "aria-label": string | undefined
  "aria-orientation": TabsOrientation
  "data-focus": BooleanDataAttr
  "data-orientation": TabsOrientation
  "data-part": "list"
  id: string
  onKeyDown: JSX.KeyboardEventHandler<HTMLElement>
  role: "tablist"
}

export interface TabsTabBindings extends TabsCommonBindings {
  "data-orientation": TabsOrientation
  "data-part": "tab"
}

export interface TabsTabButtonBindings extends TabsCommonBindings {
  "aria-controls": string | undefined
  "aria-disabled": BooleanAriaAttr
  "aria-selected": BooleanAriaAttr
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-focus-visible": BooleanDataAttr
  "data-indicator-rendered": BooleanDataAttr
  "data-orientation": TabsOrientation
  "data-ownedby": string
  "data-part": "tab-button"
  "data-selected": BooleanDataAttr
  "data-value": string
  disabled: boolean | undefined
  id: string
  onBlur: JSX.FocusEventHandler<HTMLElement>
  onClick: JSX.MouseEventHandler<HTMLElement>
  onFocus: JSX.FocusEventHandler<HTMLElement>
  onMouseDown: JSX.MouseEventHandler<HTMLElement>
  onMouseEnter: JSX.MouseEventHandler<HTMLElement>
  role: "tab"
  tabIndex: 0 | -1
  type: "button"
}

export interface TabsTabDismissButtonBindings extends TabsCommonBindings {
  "aria-label": string
  "data-part": "tab-dismiss-button"
  onClick: JSX.MouseEventHandler
  role: "button"
  type: "button"
}

export interface TabDismissButtonApiProps {
  /**
   * Optional aria label for the dismiss button.
   */
  "aria-label"?: string | null | undefined
}

export interface TabsTabIconBindings extends TabsCommonBindings {
  "data-part": "tab-icon"
}

export interface TabsIndicatorBindings extends TabsCommonBindings {
  /** Whether any tab has the simulated focus state. */
  "data-focus": BooleanDataAttr
  /** Whether any tab has the simulated focus-visible state. */
  "data-focus-visible": BooleanDataAttr
  "data-orientation": TabsOrientation
  "data-part": "indicator"
  id: string
  style: JSX.CSSProperties
}

export interface TabsApi {
  /**
   * Clears the value of the tabs.
   */
  clearValue: () => void

  /**
   * Set focus on the selected tab button
   */
  focus: () => void

  /**
   * The value of the tab that is currently focused.
   */
  focusedValue: string | null

  /**
   * Returns the state of the tab with the given props
   */
  getTabState: (props: TabProps) => TabState

  /**
   * Sets the indicator rect to the tab with the given value
   */
  setIndicatorRect: (value: string) => void

  /**
   * Sets the value of the tabs.
   */
  setValue: (value: string) => void

  /**
   * Synchronizes the tab index of the content element.
   * Useful when rendering tabs within a select or combobox
   */
  syncTabIndex: () => void

  /**
   * The current value of the tabs.
   */
  value: string | null

  // group: bindings
  getIndicatorBindings: (props: IdRegistrationProps) => TabsIndicatorBindings
  getListBindings: (props: IdRegistrationProps) => TabsListBindings
  getPanelBindings: (
    props: PanelProps & IdRegistrationProps,
  ) => TabsPanelBindings
  getRootBindings: () => TabsRootBindings
  getTabBindings: () => TabsTabBindings
  getTabButtonBindings: (
    props: TabProps & IdRegistrationProps,
  ) => TabsTabButtonBindings
  getTabDismissButtonBindings: (
    props?: TabDismissButtonApiProps,
  ) => TabsTabDismissButtonBindings
  getTabIconBindings: () => TabsTabIconBindings
}
