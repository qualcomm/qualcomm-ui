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
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

export interface DatePickerValueChangeDetails {
  value: Date | null
  valueAsString: string
}

export interface DatePickerFocusChangeDetails {
  focusedDate: Date
  view: "day" | "month" | "year"
}

export interface DatePickerViewChangeDetails {
  view: "day" | "month" | "year"
}

export interface DatePickerOpenChangeDetails {
  open: boolean
}

export interface DatePickerElementIds {
  root: string
  label: string
  input: string
  trigger: string
  content: string
  positioner: string
  calendar: string
  calendarRow(rowIndex: number): string
  calendarCell(date: string): string
  controls: string
  prevTrigger: string
  nextTrigger: string
  viewTrigger: string
  todayTrigger: string
  clearTrigger: string
  errorText: string
  hint: string
}

export interface DatePickerScope extends ScopeWithIds<DatePickerSchema> {}

export interface DatePickerPositioningOptions extends PositioningOptions {
  gutter?: number | undefined
  placement?: Placement | undefined
  sameWidth?: boolean | undefined
}

export interface DatePickerApiProps
  extends DirectionProperty,
    CommonProperties,
    InteractOutsideHandlers {
  /**
   * Whether the calendar should close when a date is selected
   * @default true
   */
  closeOnSelect?: boolean | undefined

  /**
   * The default open state of the date picker when rendered
   */
  defaultOpen?: boolean | undefined

  /**
   * The default value of the date picker when rendered
   */
  defaultValue?: Date | null | undefined

  /**
   * The default focused date when the calendar is opened
   */
  defaultFocusedDate?: Date | undefined

  /**
   * Whether the date picker is disabled
   */
  disabled?: boolean | undefined

  /**
   * The focused date in the calendar
   */
  focusedDate?: Date | undefined

  /**
   * The format of the date displayed in the input
   * @default "MM/DD/YYYY"
   */
  format?: string | undefined

  /**
   * The associate form of the underlying input
   */
  form?: string | undefined

  /**
   * The ids of the date picker elements
   */
  ids?: Partial<DatePickerElementIds> | undefined

  /**
   * Whether the date picker is invalid
   */
  invalid?: boolean | undefined

  /**
   * The locale to use for formatting dates
   * @default "en-US"
   */
  locale?: string | undefined

  /**
   * Whether to loop focus in the calendar navigation
   * @default false
   */
  loopFocus?: boolean | undefined

  /**
   * The maximum selectable date
   */
  max?: Date | undefined

  /**
   * The minimum selectable date
   */
  min?: Date | undefined

  /**
   * The name attribute of the underlying input
   */
  name?: string | undefined

  /**
   * Function called when the focused date changes
   */
  onFocusChange?: ((details: DatePickerFocusChangeDetails) => void) | undefined

  /**
   * Function called when the calendar opens or closes
   */
  onOpenChange?: ((details: DatePickerOpenChangeDetails) => void) | undefined

  /**
   * Function called when the value changes
   */
  onValueChange?: ((details: DatePickerValueChangeDetails) => void) | undefined

  /**
   * Function called when the view changes
   */
  onViewChange?: ((details: DatePickerViewChangeDetails) => void) | undefined

  /**
   * Whether the calendar is open
   */
  open?: boolean | undefined

  /**
   * The placeholder text for the input
   */
  placeholder?: string | undefined

  /**
   * The positioning options for the calendar
   */
  positioning?: DatePickerPositioningOptions | undefined

  /**
   * Whether the date picker is read-only
   */
  readOnly?: boolean | undefined

  /**
   * Whether the date picker is required
   */
  required?: boolean | undefined

  /**
   * The selected date
   */
  value?: Date | null | undefined

  /**
   * The current view of the calendar
   * @default "day"
   */
  view?: "day" | "month" | "year" | undefined
}

interface Context {
  currentPlacement: Placement | undefined
  focusedDate: Date
  value: Date | null
  valueAsString: string
  view: "day" | "month" | "year"
}

export interface DatePickerSchema {
  actions: ActionSchema<
    | "clearValue"
    | "focusDate"
    | "focusInput"
    | "focusNextDay"
    | "focusNextMonth"
    | "focusNextWeek"
    | "focusNextYear"
    | "focusPrevDay"
    | "focusPrevMonth"
    | "focusPrevWeek"
    | "focusPrevYear"
    | "focusTrigger"
    | "goToNextMonth"
    | "goToNextYear"
    | "goToPrevMonth"
    | "goToPrevYear"
    | "goToToday"
    | "invokeOnClose"
    | "invokeOnOpen"
    | "reposition"
    | "selectDate"
    | "selectFocusedDate"
    | "selectToday"
    | "setFocusedDate"
    | "setInitialFocus"
    | "setValue"
    | "setView"
    | "setViewToDay"
    | "setViewToMonth"
    | "setViewToYear"
    | "toggleVisibility"
  >
  computed: {
    isDisabled: boolean
    isEmpty: boolean
    isInteractive: boolean
  }
  context: Context
  effects: EffectSchema<
    | "trackDismissableElement"
    | "trackFocusVisible"
    | "trackPlacement"
  >
  events:
    | {type: "OPEN" | "CLOSE"}
    | {type: "CALENDAR.ESCAPE"}
    | {type: "CELL.CLICK"; value: Date}
    | {type: "CELL.POINTER_MOVE"; value: Date}
    | {type: "CONTROLLED.OPEN" | "CONTROLLED.CLOSE"}
    | {type: "INPUT.BLUR" | "INPUT.FOCUS"}
    | {type: "INPUT.CHANGE"; value: string}
    | {
        type:
          | "CALENDAR.ARROW_DOWN"
          | "CALENDAR.ARROW_LEFT"
          | "CALENDAR.ARROW_RIGHT"
          | "CALENDAR.ARROW_UP"
          | "CALENDAR.END"
          | "CALENDAR.ENTER"
          | "CALENDAR.HOME"
          | "CALENDAR.PAGE_DOWN"
          | "CALENDAR.PAGE_UP"
      }
    | {type: "NEXT_MONTH.CLICK" | "PREV_MONTH.CLICK"}
    | {type: "NEXT_YEAR.CLICK" | "PREV_YEAR.CLICK"}
    | {options: Partial<PositioningOptions>; type: "POSITIONING.SET"}
    | {type: "TODAY.CLICK"}
    | {type: "TRIGGER.CLICK"}
    | {type: "VALUE.CLEAR"}
    | {type: "VALUE.SET"; value: Date | null}
    | {type: "VIEW.CHANGE"; view: "day" | "month" | "year"}
    | {type: "VIEW_TRIGGER.CLICK"}
  guards: GuardSchema<
    | "closeOnSelect"
    | "isDateDisabled"
    | "isDateInRange"
    | "isOpenControlled"
  >
  ids: DatePickerElementIds
  props: RequiredBy<
    DatePickerApiProps,
    "closeOnSelect" | "format" | "locale" | "loopFocus" | "positioning" | "view"
  >
  refs: {}
  state: "idle" | "focused" | "open"
}

interface CommonBindings extends DirectionProperty {
  "data-scope": "date-picker"
}

export interface DatePickerRootBindings extends CommonBindings {
  "data-invalid": BooleanDataAttr
  "data-part": "root"
  "data-readonly": BooleanDataAttr
  id: string
}

export interface DatePickerLabelBindings extends CommonBindings {
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "label"
  "data-readonly": BooleanDataAttr
  htmlFor: string
  id: string
  onClick: JSX.MouseEventHandler<HTMLLabelElement>
}

export interface DatePickerInputBindings extends CommonBindings {
  "aria-controls": string
  "aria-expanded": BooleanAriaAttr
  "aria-invalid": BooleanAriaAttr
  "data-invalid": BooleanDataAttr
  "data-part": "input"
  "data-state": "open" | "closed"
  defaultValue: string
  disabled: boolean | undefined
  form: string | undefined
  id: string
  name: string | undefined
  onBlur: JSX.FocusEventHandler<HTMLInputElement>
  onChange: JSX.ChangeEventHandler<HTMLInputElement>
  onFocus: JSX.FocusEventHandler<HTMLInputElement>
  placeholder: string | undefined
  readOnly: boolean | undefined
  required: boolean | undefined
  type: "text"
}

export interface DatePickerTriggerBindings extends CommonBindings {
  "aria-controls": string
  "aria-expanded": BooleanAriaAttr
  "aria-label": "Toggle calendar"
  "data-disabled": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-part": "trigger"
  "data-state": "open" | "closed"
  disabled: boolean | undefined
  id: string
  onClick: JSX.MouseEventHandler<HTMLButtonElement>
  tabIndex: -1
  type: "button"
}

export interface DatePickerClearTriggerBindings extends CommonBindings {
  "aria-label": "Clear value"
  "data-invalid": BooleanDataAttr
  "data-part": "clear-trigger"
  disabled: boolean
  hidden: boolean
  id: string
  onClick: JSX.MouseEventHandler<HTMLButtonElement>
  type: "button"
}

export interface DatePickerPositionerBindings extends CommonBindings {
  "data-part": "positioner"
  id: string
  style: JSX.CSSProperties
}

export interface DatePickerContentBindings extends CommonBindings {
  "data-focus-visible": BooleanDataAttr
  "data-part": "content"
  "data-placement": Placement | undefined
  "data-state": "open" | "closed"
  hidden: boolean
  id: string
  role: "dialog"
  tabIndex: -1
}

export interface DatePickerCalendarBindings extends CommonBindings {
  "data-part": "calendar"
  "data-view": "day" | "month" | "year"
  id: string
  role: "grid"
}

export interface DatePickerCellProps {
  date: Date
}

export interface DatePickerCellState {
  date: Date
  dateAsString: string
  disabled: boolean
  inRange: boolean
  isToday: boolean
  outsideMonth: boolean
  selected: boolean
}

export interface DatePickerCellBindings extends CommonBindings {
  "aria-disabled": BooleanAriaAttr
  "aria-selected": BooleanAriaAttr
  "data-date": string
  "data-disabled": BooleanDataAttr
  "data-outside-month": BooleanDataAttr
  "data-part": "cell"
  "data-selected": BooleanDataAttr
  "data-today": BooleanDataAttr
  id: string
  onClick: JSX.MouseEventHandler<HTMLElement>
  onPointerMove: JSX.PointerEventHandler<HTMLElement>
  role: "gridcell"
  tabIndex: -1 | 0
}

export interface DatePickerControlsBindings extends CommonBindings {
  "data-part": "controls"
  id: string
}

export interface DatePickerPrevTriggerBindings extends CommonBindings {
  "aria-label": string
  "data-disabled": BooleanDataAttr
  "data-part": "prev-trigger"
  disabled: boolean
  id: string
  onClick: JSX.MouseEventHandler<HTMLButtonElement>
  type: "button"
}

export interface DatePickerNextTriggerBindings extends CommonBindings {
  "aria-label": string
  "data-disabled": BooleanDataAttr
  "data-part": "next-trigger"
  disabled: boolean
  id: string
  onClick: JSX.MouseEventHandler<HTMLButtonElement>
  type: "button"
}

export interface DatePickerViewTriggerBindings extends CommonBindings {
  "aria-label": "Change view"
  "data-part": "view-trigger"
  id: string
  onClick: JSX.MouseEventHandler<HTMLButtonElement>
  type: "button"
}

export interface DatePickerTodayTriggerBindings extends CommonBindings {
  "aria-label": "Go to today"
  "data-part": "today-trigger"
  id: string
  onClick: JSX.MouseEventHandler<HTMLButtonElement>
  type: "button"
}

export interface DatePickerHintBindings extends CommonBindings, InputHintBindings {}

export interface DatePickerErrorTextBindings
  extends CommonBindings,
    InputErrorTextBindings {}

export interface DatePickerErrorIndicatorBindings
  extends CommonBindings,
    InputErrorIndicatorBindings {}

export interface DatePickerApi {
  /**
   * Function to clear the selected date
   */
  clearValue(): void

  /**
   * Whether the date picker is disabled
   */
  disabled: boolean

  /**
   * Whether the date picker has no value
   */
  empty: boolean

  /**
   * Function to focus the input
   */
  focus(): void

  /**
   * Whether the input is focused
   */
  focused: boolean

  /**
   * The currently focused date in the calendar
   */
  focusedDate: Date

  /**
   * The formatted string representation of the selected date
   */
  formattedValue: string

  /**
   * Whether the calendar is open
   */
  open: boolean

  /**
   * Function to reposition the calendar
   */
  reposition(options?: Partial<PositioningOptions>): void

  /**
   * Whether the date picker is required
   */
  required: boolean | undefined

  /**
   * Function to select a date
   */
  selectDate(date: Date): void

  /**
   * Function to open or close the calendar
   */
  setOpen(open: boolean): void

  /**
   * Function to set the value
   */
  setValue(value: Date | null): void

  /**
   * Function to set the calendar view
   */
  setView(view: "day" | "month" | "year"): void

  /**
   * The selected date
   */
  value: Date | null

  /**
   * The current view of the calendar
   */
  view: "day" | "month" | "year"

  // group: bindings
  getCalendarBindings(props: IdRegistrationProps): DatePickerCalendarBindings
  getCellBindings(props: DatePickerCellProps): DatePickerCellBindings
  getCellState(props: DatePickerCellProps): DatePickerCellState
  getClearTriggerBindings(
    props: IdRegistrationProps,
  ): DatePickerClearTriggerBindings
  getContentBindings(props: IdRegistrationProps): DatePickerContentBindings
  getControlsBindings(props: IdRegistrationProps): DatePickerControlsBindings
  getErrorIndicatorBindings(): DatePickerErrorIndicatorBindings
  getErrorTextBindings(props: IdRegistrationProps): DatePickerErrorTextBindings
  getHintBindings(props: IdRegistrationProps): DatePickerHintBindings
  getInputBindings(props: IdRegistrationProps): DatePickerInputBindings
  getLabelBindings(props: IdRegistrationProps): DatePickerLabelBindings
  getNextTriggerBindings(props: IdRegistrationProps): DatePickerNextTriggerBindings
  getPositionerBindings(
    props: IdRegistrationProps,
  ): DatePickerPositionerBindings
  getPrevTriggerBindings(props: IdRegistrationProps): DatePickerPrevTriggerBindings
  getRootBindings(props: IdRegistrationProps): DatePickerRootBindings
  getTodayTriggerBindings(props: IdRegistrationProps): DatePickerTodayTriggerBindings
  getTriggerBindings(props: IdRegistrationProps): DatePickerTriggerBindings
  getViewTriggerBindings(props: IdRegistrationProps): DatePickerViewTriggerBindings
}
