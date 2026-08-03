// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  Calendar,
  CalendarIdentifier,
  DateDuration,
  DateValue,
} from "@internationalized/date"

import type {
  Placement,
  PlacementSide,
  PositioningOptions,
} from "@qualcomm-ui/dom/floating-ui"
import type {LiveRegion} from "@qualcomm-ui/dom/live-region"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {DateRangePreset} from "@qualcomm-ui/utils/date-utils"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  EffectSchema,
  GuardSchema,
  IdRegistrationProps,
  JSX,
  MachineSchema,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

import type {datePickerAnatomy} from "./date-picker.anatomy.js"

/** callback details */

export type DatePickerDateView = "day" | "month" | "year"

export type DatePickerViewOnSelect = "previous" | "min"

export interface DatePickerValueChangeDetails {
  value: (DateValue | null)[]
  valueAsString: string[]
  view: DatePickerDateView
}

export interface DatePickerFocusChangeDetails extends DatePickerValueChangeDetails {
  focusedValue: DateValue
  view: DatePickerDateView
}

export interface DatePickerLocaleDetails {
  locale: string
  timeZone: string
}

export interface DatePickerViewChangeDetails {
  view: DatePickerDateView
}

export interface DatePickerVisibleRangeChangeDetails {
  view: DatePickerDateView
  visibleRange: {end: DateValue; start: DateValue}
}

export interface DatePickerOpenChangeDetails {
  open: boolean
  value: (DateValue | null)[]
}

export interface DatePickerTime {
  hour?: number
  millisecond?: number
  minute?: number
  second?: number
}

/** machine context */

export type DatePickerSelectionMode = "single" | "multiple" | "range"

export interface DatePickerIntlTranslations {
  clearTrigger?: string | undefined
  content?: string | undefined
  dayCell?: ((state: DatePickerDayTableCellState) => string) | undefined
  errorIndicator?: string | undefined
  nextTrigger?: ((view: DatePickerDateView) => string) | undefined
  placeholder?:
    | ((locale: string) => {day: string; month: string; year: string})
    | undefined
  presetsTrigger?: ((open: boolean) => string) | undefined
  presetTrigger?: ((value: string[]) => string) | undefined
  prevTrigger?: ((view: DatePickerDateView) => string) | undefined
  rangeInputEnd?: string | undefined
  rangeInputStart?: string | undefined
  trigger?: ((open: boolean) => string) | undefined
  viewCloseTrigger?: string | undefined
  viewTrigger?:
    | ((view: DatePickerDateView, targetView?: DatePickerDateView) => string)
    | undefined
}

export interface DatePickerApiProps extends DirectionProperty {
  /**
   * Whether the calendar should close after the date selection is complete.
   * This is ignored when the selection mode is `multiple`.
   * @default true
   */
  closeOnSelect?: boolean | undefined
  /**
   * Pass this to support non-Gregorian calendars (Persian, Buddhist, Islamic,
   * etc.), which keeps every calendar out of the bundle unless you opt in. The
   * picker calls it with the calendar identifier resolved from `locale`.
   *
   * @example
   * ```ts
   * import {createCalendar} from "@internationalized/date"
   *
   * const props = {createCalendar, locale: "fa-IR"}
   * ```
   */
  createCalendar?: ((identifier: CalendarIdentifier) => Calendar) | undefined
  /**
   * The initial focused date when rendered.
   * Use when you don't need to control the focused date of the date picker.
   */
  defaultFocusedValue?: DateValue | undefined
  /**
   * The initial open state of the date picker when rendered.
   * Use when you don't need to control the open state of the date picker.
   */
  defaultOpen?: boolean | undefined
  /**
   * The initial selected date(s) when rendered.
   * Use when you don't need to control the selected date(s) of the date picker.
   */
  defaultValue?: (DateValue | null)[] | undefined
  /**
   * The default view of the calendar
   * @default "day"
   */
  defaultView?: DatePickerDateView | undefined
  /**
   * Whether the calendar is disabled.
   */
  disabled?: boolean | undefined
  /**
   * Whether the calendar should have a fixed number of weeks.
   * This renders the calendar with 6 weeks instead of 5 or 6.
   */
  fixedWeeks?: boolean | undefined
  /**
   * The controlled focused date.
   */
  focusedValue?: DateValue | undefined
  /**
   * The format of the date to display in the input.
   */
  format?:
    | ((date: DateValue, details: DatePickerLocaleDetails) => string)
    | undefined
  /**
   * Whether to render the date picker inline
   */
  inline?: boolean | undefined
  /**
   * Whether the date picker is invalid
   */
  invalid?: boolean | undefined
  /**
   * Returns whether a date of the calendar is available.
   */
  isDateUnavailable?: ((date: DateValue, locale: string) => boolean) | undefined
  /**
   * The locale (BCP 47 language tag) to use when formatting the date.
   * @default "en-US"
   */
  locale?: string | undefined
  /**
   * The maximum date that can be selected.
   */
  max?: DateValue | undefined
  /**
   * The maximum number of dates that can be selected.
   * This is only applicable when `selectionMode` is `multiple`.
   */
  maxSelectedDates?: number | undefined
  /**
   * The maximum view of the calendar
   * @default "year"
   */
  maxView?: DatePickerDateView | undefined
  /**
   * The minimum date that can be selected.
   */
  min?: DateValue | undefined
  /**
   * The minimum view of the calendar
   * @default "day"
   */
  minView?: DatePickerDateView | undefined
  /**
   * The `name` attribute of the input element.
   */
  name?: string | undefined
  /**
   * The number of months to display.
   */
  numOfMonths?: number | undefined
  /**
   * Function called when the focused date changes.
   */
  onFocusChange?: ((details: DatePickerFocusChangeDetails) => void) | undefined
  /**
   * Function called when the calendar opens or closes.
   */
  onOpenChange?: ((details: DatePickerOpenChangeDetails) => void) | undefined
  /**
   * Function called when the value changes.
   */
  onValueChange?: ((details: DatePickerValueChangeDetails) => void) | undefined
  /**
   * Function called when the view changes.
   */
  onViewChange?: ((details: DatePickerViewChangeDetails) => void) | undefined
  /**
   * Function called when the visible range changes.
   */
  onVisibleRangeChange?:
    | ((details: DatePickerVisibleRangeChangeDetails) => void)
    | undefined
  /**
   * The controlled open state of the date picker
   */
  open?: boolean | undefined
  /**
   * Whether to open the calendar when the input is clicked.
   * @default false
   */
  openOnClick?: boolean | undefined
  /**
   * Whether day outside the visible range can be selected.
   * @default false
   */
  outsideDaySelectable?: boolean | undefined
  /**
   * Function to parse the date from the input back to a DateValue.
   */
  parse?:
    | ((
        value: string,
        details: DatePickerLocaleDetails,
      ) => DateValue | undefined)
    | undefined
  /**
   * The placeholder text to display in the input.
   */
  placeholder?: string | undefined
  /**
   * The user provided options used to position the date picker content
   *
   * @inheritDoc
   */
  positioning?: DatePickerPositioningOptions | undefined
  /**
   * Whether the calendar is read-only.
   */
  readOnly?: boolean | undefined
  /**
   * Whether the date picker is required
   */
  required?: boolean | undefined
  /**
   * The selection mode of the calendar.
   * - `single` - only one date can be selected
   * - `multiple` - multiple dates can be selected
   * - `range` - a range of dates can be selected
   *
   * @default "single"
   */
  selectionMode?: DatePickerSelectionMode | undefined
  /**
   * The first day of the week.
   *  `0` - Sunday
   *  `1` - Monday
   *  `2` - Tuesday
   *  `3` - Wednesday
   *  `4` - Thursday
   *  `5` - Friday
   *  `6` - Saturday
   */
  startOfWeek?: number | undefined
  /**
   * The time zone to use
   * @default "UTC"
   */
  timeZone?: string | undefined
  /**
   * The localized messages to use.
   */
  translations?: DatePickerIntlTranslations | undefined
  /**
   * The controlled selected date(s).
   */
  value?: (DateValue | null)[] | undefined
  /**
   * The view of the calendar
   */
  view?: DatePickerDateView | undefined
  /**
   * The view to show after a selection.
   * 'previous'` = year → month → day
   * `'min'` = <current view> → <min view>
   * @default 'min'
   */
  viewOnSelect?: DatePickerViewOnSelect | undefined
}

export interface DatePickerPositioningOptions extends PositioningOptions {
  /**
   * The initial placement of the floating element
   * @default 'bottom-start'
   */
  placement?: Placement | undefined
}

interface InputValue {
  index: number
  value: string
}

interface PrivateContext {
  /**
   * The index of the currently active date.
   * Used in range selection mode.
   */
  activeIndex: number
  /**
   * The computed placement (maybe different from initial placement)
   */
  currentPlacement?: Placement | undefined
  /**
   * Whether an ancestor `fieldset` is disabled.
   */
  fieldsetDisabled: boolean
  /**
   * The focused date.
   */
  focusedValue: DateValue
  /**
   * Whether the calendar has focus
   */
  hasFocus?: boolean | undefined
  /**
   * The current hovered date. Useful for range selection mode.
   */
  hoveredValue: DateValue | null
  /**
   * The pending text of the input the user last typed in, paired with that
   * input's index.
   */
  inputValue: InputValue
  /**
   * Whether the presets panel is shown in place of the calendar.
   */
  presetsOpen: boolean
  /**
   * Whether the calendar should restore focus to the input when it closes.
   */
  restoreFocus?: boolean | undefined
  /**
   * The start date of the current visible duration.
   */
  startValue: DateValue
  /**
   * The selected date(s).
   */
  value: (DateValue | null)[]
  /**
   * The view of the calendar.
   */
  view: DatePickerDateView
}

type ComputedContext = Readonly<{
  /**
   * Whether the calendar is disabled.
   */
  disabled: boolean
  /**
   * The end date of the current visible duration.
   */
  endValue: DateValue
  /**
   * Whether the calendar is interactive.
   */
  isInteractive: boolean
  /**
   * Whether the next visible range is valid.
   */
  isNextVisibleRangeValid: boolean
  /**
   * Whether the previous visible range is valid.
   */
  isPrevVisibleRangeValid: boolean
  /**
   * The value text to display in the input.
   */
  valueAsString: string[]
  /**
   * The duration of the visible range.
   */
  visibleDuration: DateDuration
  /**
   * The start/end date of the current visible duration.
   */
  visibleRange: {end: DateValue; start: DateValue}
  /**
   * The text to announce when the visible range changes.
   */
  visibleRangeText: {end: string; formatted: string; start: string}
}>

/** component API */

export interface DatePickerDayTableCellState extends DatePickerTableCellState {
  invalid: boolean
  today: boolean
  unavailable: boolean
  weekend: boolean
}

export interface DatePickerElementIds {
  clearTrigger: string
  content: string
  control: string
  errorText: string
  hint: string
  input: string[]
  positioner: string
  trigger: string
}

export interface DatePickerScope extends ScopeWithIds<DatePickerSchema> {}

type Actions = ActionSchema<
  | "cancelSyncInputElement"
  | "closePresets"
  | "togglePresets"
  | "adjustValueToSelectionMode"
  | "setNextView"
  | "setPreviousView"
  | "setMinView"
  | "setView"
  | "setRestoreFocus"
  | "announceValueText"
  | "announceVisibleRange"
  | "disableTextSelection"
  | "enableTextSelection"
  | "focusFirstSelectedDate"
  | "syncInputElement"
  | "setFocusedDate"
  | "setFocusedValueForView"
  | "focusNextMonth"
  | "focusPreviousMonth"
  | "setDateValue"
  | "clearDateValue"
  | "setSelectedDate"
  | "resetSelection"
  | "toggleSelectedDate"
  | "setHoveredDate"
  | "clearHoveredDate"
  | "clearRestoreFocus"
  | "selectFocusedDate"
  | "focusPreviousDay"
  | "focusNextDay"
  | "focusPreviousWeek"
  | "focusNextWeek"
  | "focusNextPage"
  | "focusPreviousPage"
  | "focusSectionStart"
  | "focusSectionEnd"
  | "focusNextSection"
  | "focusPreviousSection"
  | "focusNextYear"
  | "focusPreviousYear"
  | "focusNextDecade"
  | "focusPreviousDecade"
  | "clearFocusedDate"
  | "focusPreviousMonthColumn"
  | "focusNextMonthColumn"
  | "focusPreviousYearColumn"
  | "focusNextYearColumn"
  | "focusFirstMonth"
  | "focusLastMonth"
  | "focusFirstYear"
  | "focusLastYear"
  | "setActiveIndex"
  | "setActiveIndexToEnd"
  | "setActiveIndexToStart"
  | "focusActiveCell"
  | "focusActiveCellIfNeeded"
  | "setHoveredValueIfKeyboard"
  | "focusTriggerElement"
  | "focusFirstInputElement"
  | "focusInputElement"
  | "setInputValue"
  | "syncInputValue"
  | "focusParsedDate"
  | "selectParsedDate"
  | "resetView"
  | "setStartValue"
  | "invokeOnOpen"
  | "invokeOnClose"
  | "invokeOnVisibleRangeChange"
  | "toggleVisibility"
  | "snapshotValue"
  | "restoreSnapshot"
  | "resumeRangeSelection"
>

type Events =
  | {
      type: "FOCUS.SET"
      value: DateValue
    }
  | {
      type: "VALUE.SET"
      value: DateValue | (DateValue | null)[]
    }
  | {
      focus?: boolean
      type: "VALUE.CLEAR"
    }
  | {
      type: "VALUE.TOGGLE"
      value: DateValue
    }
  | {
      type: "TRIGGER.CLICK"
    }
  | {
      src?: string
      type: "OPEN"
    }
  | {
      type: "CLOSE"
    }
  | {
      type: "CANCEL"
    }
  | {
      previousEvent: Events
      type: "CONTROLLED.OPEN"
    }
  | {
      previousEvent: Events
      type: "CONTROLLED.CLOSE"
    }
  | {
      type: "INTERACT_OUTSIDE"
    }
  | {
      type: "VIEW.SET"
      view: DatePickerDateView
    }
  | {
      type: "GOTO.NEXT"
      view: DatePickerDateView
    }
  | {
      type: "GOTO.PREV"
      view: DatePickerDateView
    }
  | {
      src: string | undefined
      type: "VIEW.TOGGLE"
    }
  | {
      type: "PRESET.TOGGLE"
    }
  | {
      index: number
      type: "INPUT.FOCUS"
    }
  | {
      fixOnBlur: boolean
      index: number
      type: "INPUT.BLUR"
      value: string
    }
  | {
      index: number
      type: "INPUT.ENTER"
      value: string
    }
  | {
      index: number
      type: "INPUT.CHANGE"
      value: string
    }
  | {
      type: "PRESET.CLICK"
      value: DateValue[]
    }
  | {
      src: string
      type: "TABLE.ESCAPE"
    }
  | {
      columns: number
      focus: boolean
      type: "TABLE.HOME"
      view: DatePickerDateView
    }
  | {
      columns: number
      focus: boolean
      type: "TABLE.END"
      view: DatePickerDateView
    }
  | {
      columns: number
      focus: boolean
      type: "TABLE.ENTER"
      view: DatePickerDateView
    }
  | {
      columns: number
      focus: boolean
      type: "TABLE.ARROW_LEFT"
      view: DatePickerDateView
    }
  | {
      columns: number
      focus: boolean
      type: "TABLE.ARROW_RIGHT"
      view: DatePickerDateView
    }
  | {
      columns: number
      focus: boolean
      type: "TABLE.ARROW_UP"
      view: DatePickerDateView
    }
  | {
      columns: number
      focus: boolean
      type: "TABLE.ARROW_DOWN"
      view: DatePickerDateView
    }
  | {
      columns: number
      focus: boolean
      larger: boolean
      type: "TABLE.PAGE_UP"
      view: DatePickerDateView
    }
  | {
      columns: number
      focus: boolean
      larger: boolean
      type: "TABLE.PAGE_DOWN"
      view: DatePickerDateView
    }
  | {
      columns: number
      focus: boolean
      type: "HOME"
      view: DatePickerDateView
    }
  | {
      columns: number
      focus: boolean
      type: "END"
      view: DatePickerDateView
    }
  | {
      type: "TABLE.POINTER_LEAVE"
    }
  | {
      type: "TABLE.POINTER_DOWN"
      view: DatePickerDateView
    }
  | {
      type: "TABLE.POINTER_UP"
      view: DatePickerDateView
    }
  | {
      cell: Exclude<DatePickerDateView, "day">
      type: "CELL.CLICK"
      value: number
    }
  | {
      cell: Extract<DatePickerDateView, "day">
      type: "CELL.CLICK"
      value: DateValue
    }
  | {
      cell: DatePickerDateView
      focus: boolean
      outsideRange?: boolean
      type: "CELL.POINTER_MOVE"
      value: DateValue
    }

type UnionKeys<T> = T extends T ? keyof T : never
type UnionPropType<T, K extends PropertyKey> = T extends {[P in K]?: unknown}
  ? T[K]
  : never
export type DatePickerActionEvent = {
  [K in UnionKeys<Events>]?: UnionPropType<Events, K>
}

export interface DatePickerSchema extends MachineSchema {
  actions: Actions
  computed: ComputedContext
  context: PrivateContext
  effects: EffectSchema<
    | "setupLiveRegion"
    | "trackDismissableElement"
    | "trackFormControlState"
    | "trackPositioning"
  >
  events: Events
  guards: GuardSchema<
    | "canPreviewRange"
    | "canSelectDate"
    | "closeOnSelect"
    | "hasSelectedRange"
    | "isAboveMinView"
    | "isDayPointerMoveOutsideVisibleMonth"
    | "isDayView"
    | "isInputValueEmpty"
    | "isInteractOutsideEvent"
    | "isInteractive"
    | "isMonthView"
    | "isMultiPicker"
    | "isOpenControlled"
    | "isRangePicker"
    | "isYearView"
    | "selectsToMinView"
    | "shouldFixOnBlur"
    | "shouldRestoreFocus"
  >
  ids: DatePickerElementIds
  props: RequiredBy<DatePickerApiProps, "dir">
  refs: {
    announcer?: LiveRegion | undefined
    syncInputElementCleanup?: VoidFunction | undefined
    valueSnapshot?: (DateValue | null)[] | undefined
  }
}

export interface DatePickerRange<T> {
  end: T
  start: T
}

export type DatePickerVisibleRange = DatePickerRange<DateValue>

export interface DatePickerVisibleRangeText extends DatePickerRange<string> {
  formatted: string
}

export interface DatePickerWeekDay {
  long: string
  narrow: string
  short: string
  value: DateValue
}

export interface DatePickerMonthFormatOptions {
  format?: "short" | "long" | undefined
}

export interface DatePickerDateValueOffset {
  visibleRange: DatePickerVisibleRange
  visibleRangeText: {end: string; start: string}
  weeks: DateValue[][]
}

export interface DatePickerCell {
  disabled?: boolean | undefined
  label: string
  value: number
}

export interface DatePickerApiDayTableCellProps {
  disabled?: boolean | undefined
  value: DateValue
  visibleRange?: DatePickerVisibleRange | undefined
}

export interface DatePickerApiTableCellProps {
  columns?: number | undefined
  disabled?: boolean | undefined
  value: number
}

export interface DatePickerTableCellState {
  readonly disabled: boolean
  firstInHoveredRange: boolean
  firstInRange: boolean
  focused: boolean
  inHoveredRange: boolean
  inRange: boolean
  lastInHoveredRange: boolean
  lastInRange: boolean
  outsideRange: boolean
  selectable: boolean
  selected: boolean
  value: DateValue
  valueText: string
}

export interface DatePickerApiTableProps {
  columns?: number | undefined
  view?: DatePickerDateView | undefined
}

export interface DatePickerApiMonthGridProps {
  columns?: number | undefined
  format?: "short" | "long" | undefined
}

export type DatePickerMonthGridValue = DatePickerCell[][]

export interface DatePickerApiYearGridProps {
  columns?: number | undefined
}

export type DatePickerYearGridValue = DatePickerCell[][]

export interface DatePickerApiViewProps {
  view?: DatePickerDateView | undefined
}

export interface DatePickerApiViewTriggerProps extends DatePickerApiViewProps {
  /**
   * The view to switch to when the trigger is activated. When omitted, the
   * trigger toggles to the next view instead.
   */
  goToView?: DatePickerDateView | undefined
}

export interface DatePickerApiHiddenInputProps {
  /**
   * The index of the selected date this hidden input represents.
   */
  index?: number | undefined
  /**
   * The formatted value submitted with the form.
   */
  value?: string | undefined
}

export interface DatePickerApiInputProps {
  /**
   * Whether to fix the input value on blur.
   * @default true
   */
  fixOnBlur?: boolean | undefined
  /**
   * The index of the input to focus.
   */
  index?: number | undefined
}

export interface DatePickerApiLabelProps {
  index?: number | undefined
}

export type DatePickerPresetTriggerValue = DateValue[] | DateRangePreset

export interface DatePickerApiPresetTriggerProps {
  value: DatePickerPresetTriggerValue
}

export interface DatePickerApi {
  /**
   * Discards selection, restores previous value, and closes the calendar.
   */
  cancel: VoidFunction
  /**
   * Clears the selected date(s).
   */
  clearValue: (options?: {focus?: boolean}) => void
  /**
   * Whether the date picker is disabled
   */
  disabled: boolean
  /**
   * Whether the input is focused
   */
  focused: boolean
  /**
   * The focused date.
   */
  focusedValue: DateValue
  /**
   * The focused date as a Date object.
   */
  focusedValueAsDate: Date
  /**
   * The focused date as a string.
   */
  focusedValueAsString: string
  /**
   * Function to set the selected month.
   */
  focusMonth: (month: number) => void
  /**
   * Function to set the selected year.
   */
  focusYear: (year: number) => void
  /**
   * Formats the given date value based on the provided options.
   */
  format: (value: DateValue, opts?: Intl.DateTimeFormatOptions) => string
  /**
   * Returns an array of days in the week index counted from the provided start
   * date, or the first visible date if not given.
   */
  getDaysInWeek: (week: number, from?: DateValue) => DateValue[]
  /**
   * Returns the state details for a given cell.
   */
  getDayTableCellState: (
    props: DatePickerApiDayTableCellProps,
  ) => DatePickerDayTableCellState
  /**
   * Returns the start and end years of the decade.
   */
  getDecade: () => DatePickerRange<number | undefined>
  /**
   * Returns the months of the year
   */
  getMonths: (props?: DatePickerMonthFormatOptions) => DatePickerCell[]
  /**
   * Returns the months of the year based on the columns.
   * Represented as an array of arrays of months.
   */
  getMonthsGrid: (
    props?: DatePickerApiMonthGridProps,
  ) => DatePickerMonthGridValue
  /**
   * Returns the state details for a given month cell.
   */
  getMonthTableCellState: (
    props: DatePickerApiTableCellProps,
  ) => DatePickerTableCellState
  /**
   * Returns the weeks of the month from the provided date. Represented as an array
   * of arrays of dates.
   */
  getMonthWeeks: (from?: DateValue) => DateValue[][]
  /**
   * Returns the offset of the month based on the provided number of months.
   */
  getOffset: (duration: DateDuration) => DatePickerDateValueOffset
  /**
   * Returns the range of dates based on the provided date range preset.
   */
  getRangePresetValue: (value: DateRangePreset) => DateValue[]
  /**
   * Returns the months of the year
   */
  getYears: () => DatePickerCell[]
  /**
   * Returns the years of the decade based on the columns.
   * Represented as an array of arrays of years.
   */
  getYearsGrid: (props?: DatePickerApiYearGridProps) => DatePickerYearGridValue
  /**
   * Returns the state details for a given year cell.
   */
  getYearTableCellState: (
    props: DatePickerApiTableCellProps,
  ) => DatePickerTableCellState
  /**
   * Goes to the next month/year/decade.
   */
  goToNext: VoidFunction
  /**
   * Goes to the previous month/year/decade.
   */
  goToPrev: VoidFunction
  /**
   * Whether the date picker is rendered inline
   */
  inline: boolean
  /**
   * Whether the date picker is invalid
   */
  invalid: boolean
  /**
   * Whether the maximum number of selected dates has been reached.
   */
  isMaxSelected: boolean
  /**
   * Returns whether the provided date is available (or can be selected)
   */
  isUnavailable: (date: DateValue) => boolean
  /**
   * The maximum number of dates that can be selected (only for multiple
   * selection mode).
   */
  maxSelectedDates: number | undefined
  /**
   * The number of months to display
   */
  numOfMonths: number
  /**
   * Whether the date picker is open
   */
  open: boolean
  /**
   * Whether the presets panel is open
   */
  presetsOpen: boolean
  /**
   * Whether the date picker is read-only
   */
  readOnly: boolean
  /**
   * The selection mode (single, multiple, or range)
   */
  selectionMode: DatePickerSelectionMode
  /**
   * Sets the selected date to today.
   */
  selectToday: VoidFunction
  /**
   * Sets the focused date to the given date.
   */
  setFocusedValue: (value: DateValue) => void
  /**
   * Function to open or close the calendar.
   */
  setOpen: (open: boolean) => void
  /**
   * Sets the time for a specific date value.
   * Converts CalendarDate to CalendarDateTime if needed.
   */
  setTime: (time: DatePickerTime, index?: number) => void
  /**
   * Sets the selected date to the given date.
   */
  setValue: (values: (DateValue | null)[]) => void
  /**
   * Sets the view of the date picker.
   */
  setView: (view: DatePickerDateView) => void
  /**
   * Adds/removes a date in the selection.
   */
  toggleValue: (value: DateValue) => void
  /**
   * The selected date.
   */
  value: (DateValue | null)[]
  /**
   * The selected date as a Date object.
   */
  valueAsDate: (Date | null)[]
  /**
   * The selected date as a string.
   */
  valueAsString: string[]
  /**
   * The current view of the date picker
   */
  view: DatePickerDateView
  /**
   * The visible range of dates.
   */
  visibleRange: DatePickerVisibleRange
  /**
   * The human readable text for the visible range of dates.
   */
  visibleRangeText: DatePickerVisibleRangeText
  /**
   * The days of the week. Represented as an array of strings.
   */
  weekDays: DatePickerWeekDay[]
  /**
   * The weeks of the month. Represented as an array of arrays of dates.
   */
  weeks: DateValue[][]

  // group: bindings
  getClearTriggerBindings: (
    params: IdRegistrationProps,
  ) => DatePickerClearTriggerBindings
  getContentBindings: (params: IdRegistrationProps) => DatePickerContentBindings
  getControlBindings: (params: IdRegistrationProps) => DatePickerControlBindings
  getDayTableCellBindings: (
    props: DatePickerApiDayTableCellProps,
  ) => DatePickerDayTableCellBindings
  getDayTableCellTriggerBindings: (
    props: DatePickerApiDayTableCellProps,
  ) => DatePickerDayTableCellTriggerBindings
  getErrorIndicatorBindings: () => DatePickerErrorIndicatorBindings
  getErrorTextBindings: (
    props: IdRegistrationProps,
  ) => DatePickerErrorTextBindings
  getHiddenInputBindings: (
    props: DatePickerApiHiddenInputProps,
  ) => DatePickerHiddenInputBindings
  getHintBindings: (props: IdRegistrationProps) => DatePickerHintBindings
  getInputBindings: (
    params: IdRegistrationProps & DatePickerApiInputProps,
  ) => DatePickerInputBindings
  getInputGroupBindings: () => DatePickerInputGroupBindings
  getInputGroupTriggerBindings: (
    params: IdRegistrationProps,
  ) => DatePickerInputGroupTriggerBindings
  getLabelBindings: (props?: DatePickerApiLabelProps) => DatePickerLabelBindings
  getMonthTableCellBindings: (
    props: DatePickerApiTableCellProps,
  ) => DatePickerMonthTableCellBindings
  getMonthTableCellTriggerBindings: (
    props: DatePickerApiTableCellProps,
  ) => DatePickerMonthTableCellTriggerBindings
  getNextTriggerBindings: (
    props: DatePickerApiViewProps,
  ) => DatePickerNextTriggerBindings
  getPositionerBindings: (
    params: IdRegistrationProps,
  ) => DatePickerPositionerBindings
  getPresetsBindings: () => DatePickerPresetsBindings
  getPresetsTriggerBindings: () => DatePickerPresetsTriggerBindings
  getPresetTriggerBindings: (
    props: DatePickerApiPresetTriggerProps,
  ) => DatePickerPresetTriggerBindings
  getPrevTriggerBindings: (
    props: DatePickerApiViewProps,
  ) => DatePickerPrevTriggerBindings
  getRangeTextBindings: () => DatePickerRangeTextBindings
  getRootBindings: () => DatePickerRootBindings
  getTableBindings: (props: DatePickerApiTableProps) => DatePickerTableBindings
  getTableBodyBindings: (
    props: DatePickerApiTableProps,
  ) => DatePickerTableBodyBindings
  getTableHeadBindings: (
    props: DatePickerApiTableProps,
  ) => DatePickerTableHeadBindings
  getTableHeaderBindings: (
    props: DatePickerApiTableProps,
  ) => DatePickerTableHeaderBindings
  getTableRowBindings: (
    props: DatePickerApiTableProps,
  ) => DatePickerTableRowBindings
  getTriggerBindings: (params: IdRegistrationProps) => DatePickerTriggerBindings
  getViewBindings: (props: DatePickerApiViewProps) => DatePickerViewBindings
  getViewCloseTriggerBindings: () => DatePickerViewCloseTriggerBindings
  getViewControlBindings: (
    props: DatePickerApiViewProps,
  ) => DatePickerViewControlBindings
  getViewTriggerBindings: (
    props?: DatePickerApiViewTriggerProps,
  ) => DatePickerViewTriggerBindings
  getYearTableCellBindings: (
    props: DatePickerApiTableCellProps,
  ) => DatePickerYearTableCellBindings
  getYearTableCellTriggerBindings: (
    props: DatePickerApiTableCellProps,
  ) => DatePickerYearTableCellTriggerBindings
}

type CommonBindings = DirectionProperty

type PartName = AnatomyPartName<typeof datePickerAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"datePicker", P> {}

export interface DatePickerRootBindings extends CommonBindings, Part<"root"> {
  "data-disabled": BooleanDataAttr
  "data-empty": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  "data-state": "open" | "closed"
}

export interface DatePickerLabelBindings extends CommonBindings, Part<"label"> {
  "data-disabled": BooleanDataAttr
  "data-readonly": BooleanDataAttr
  "data-state": "open" | "closed"
  onClick: JSX.MouseEventHandler | undefined
}

export interface DatePickerControlBindings
  extends CommonBindings, Part<"control"> {
  "data-disabled": BooleanDataAttr
  "data-placeholder-shown": BooleanDataAttr
  id: string
}

export interface DatePickerHintBindings extends CommonBindings, Part<"hint"> {
  "data-disabled": BooleanDataAttr
  hidden: boolean
  id: string
}

export interface DatePickerErrorTextBindings
  extends CommonBindings, Part<"errorText"> {
  "aria-live": "polite"
  hidden: boolean
  id: string
}

export interface DatePickerErrorIndicatorBindings
  extends CommonBindings, Part<"errorIndicator"> {
  "aria-label": string
  hidden: boolean
}

export interface DatePickerContentBindings
  extends CommonBindings, Part<"content"> {
  "aria-label": string
  "aria-roledescription": "datepicker"
  "data-inline": BooleanDataAttr
  "data-placement": Placement
  "data-presets-open": BooleanDataAttr
  "data-side": PlacementSide | undefined
  "data-state": "open" | "closed"
  hidden: boolean
  id: string
  role: "application"
  tabIndex: -1
}

export interface DatePickerTableBindings extends CommonBindings, Part<"table"> {
  "aria-disabled": BooleanAriaAttr
  "aria-label": string
  "aria-multiselectable": BooleanAriaAttr
  "aria-readonly": BooleanAriaAttr
  "aria-roledescription": string
  "data-columns": number
  "data-view": DatePickerDateView
  onKeyDown: JSX.KeyboardEventHandler<HTMLTableElement>
  onPointerDown: JSX.PointerEventHandler
  onPointerLeave: JSX.PointerEventHandler
  onPointerUp: JSX.PointerEventHandler
  role: "grid"
  tabIndex: -1
}

export interface DatePickerTableHeadBindings
  extends CommonBindings, Part<"tableHead"> {
  "data-disabled": BooleanDataAttr
  "data-view": DatePickerDateView
}

export interface DatePickerTableHeaderBindings
  extends CommonBindings, Part<"tableHeader"> {
  "data-disabled": BooleanDataAttr
  "data-view": DatePickerDateView
}

export interface DatePickerTableBodyBindings
  extends CommonBindings, Part<"tableBody"> {
  "data-disabled": BooleanDataAttr
  "data-view": DatePickerDateView
}

export interface DatePickerTableRowBindings
  extends CommonBindings, Part<"tableRow"> {
  "aria-disabled": BooleanAriaAttr
  "data-disabled": BooleanDataAttr
  "data-view": DatePickerDateView
}

export interface DatePickerDayTableCellBindings
  extends CommonBindings, Part<"tableCell"> {
  "aria-current": "date" | undefined
  "aria-disabled": BooleanAriaAttr
  "aria-invalid": BooleanAriaAttr
  "aria-selected": boolean
  "data-value": string
  role: "gridcell"
}

export interface DatePickerDayTableCellTriggerBindings
  extends CommonBindings, Part<"tableCellTrigger"> {
  "aria-disabled": BooleanAriaAttr
  "aria-invalid": BooleanAriaAttr
  "aria-label": string
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-hover-range-end": BooleanDataAttr
  "data-hover-range-start": BooleanDataAttr
  "data-in-hover-range": BooleanDataAttr
  "data-in-range": BooleanDataAttr
  "data-outside-range": BooleanDataAttr
  "data-range-end": BooleanDataAttr
  "data-range-start": BooleanDataAttr
  "data-selectable": BooleanDataAttr
  "data-selected": BooleanDataAttr
  "data-today": BooleanDataAttr
  "data-unavailable": BooleanDataAttr
  "data-value": string
  "data-view": "day"
  "data-weekend": BooleanDataAttr
  onClick: JSX.MouseEventHandler
  onPointerMove: JSX.PointerEventHandler | undefined
  role: "button"
  tabIndex: 0 | -1
}

export interface DatePickerMonthTableCellBindings
  extends CommonBindings, Part<"tableCell"> {
  "aria-disabled": BooleanAriaAttr
  "aria-selected": BooleanAriaAttr
  colSpan: number | undefined
  "data-selected": BooleanDataAttr
  "data-value": number
  role: "gridcell"
}

export interface DatePickerMonthTableCellTriggerBindings
  extends CommonBindings, Part<"tableCellTrigger"> {
  "aria-disabled": BooleanAriaAttr
  "aria-label": string
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-hover-range-end": BooleanDataAttr
  "data-hover-range-start": BooleanDataAttr
  "data-in-hover-range": BooleanDataAttr
  "data-in-range": BooleanDataAttr
  "data-outside-range": BooleanDataAttr
  "data-range-end": BooleanDataAttr
  "data-range-start": BooleanDataAttr
  "data-selectable": BooleanDataAttr
  "data-selected": BooleanDataAttr
  "data-value": number
  "data-view": "month"
  onClick: JSX.MouseEventHandler
  onPointerMove: JSX.PointerEventHandler | undefined
  role: "button"
  tabIndex: 0 | -1
}

export interface DatePickerYearTableCellBindings
  extends CommonBindings, Part<"tableCell"> {
  "aria-disabled": BooleanAriaAttr
  "aria-selected": BooleanAriaAttr
  colSpan: number | undefined
  "data-selected": BooleanDataAttr
  "data-value": number
  role: "gridcell"
}

export interface DatePickerYearTableCellTriggerBindings
  extends CommonBindings, Part<"tableCellTrigger"> {
  "aria-disabled": BooleanAriaAttr
  "aria-label": string
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-hover-range-end": BooleanDataAttr
  "data-hover-range-start": BooleanDataAttr
  "data-in-hover-range": BooleanDataAttr
  "data-in-range": BooleanDataAttr
  "data-outside-range": BooleanDataAttr
  "data-range-end": BooleanDataAttr
  "data-range-start": BooleanDataAttr
  "data-selectable": BooleanDataAttr
  "data-selected": BooleanDataAttr
  "data-value": number
  "data-view": "year"
  onClick: JSX.MouseEventHandler
  onPointerMove: JSX.PointerEventHandler | undefined
  role: "button"
  tabIndex: 0 | -1
}

export interface DatePickerNextTriggerBindings
  extends CommonBindings, Part<"nextTrigger"> {
  "aria-label": string
  "data-disabled": BooleanDataAttr
  disabled: boolean
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface DatePickerPrevTriggerBindings
  extends CommonBindings, Part<"prevTrigger"> {
  "aria-label": string
  "data-disabled": BooleanDataAttr
  disabled: boolean
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface DatePickerRangeTextBindings
  extends CommonBindings, Part<"rangeText"> {}

export interface DatePickerClearTriggerBindings
  extends CommonBindings, Part<"clearTrigger"> {
  "aria-label": string
  disabled: boolean
  hidden: boolean
  id: string
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface DatePickerTriggerBindings
  extends CommonBindings, Part<"trigger"> {
  "aria-controls": string
  "aria-expanded": boolean
  "aria-haspopup": "grid"
  "aria-label": string
  "data-placeholder-shown": BooleanDataAttr
  "data-placement": Placement | undefined
  "data-side": PlacementSide | undefined
  "data-state": "open" | "closed"
  disabled: boolean | undefined
  id: string
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface DatePickerViewBindings extends CommonBindings, Part<"view"> {
  "data-view": DatePickerDateView
  hidden: boolean
}

export interface DatePickerViewTriggerBindings
  extends CommonBindings, Part<"viewTrigger"> {
  "aria-label": string
  "data-view": DatePickerDateView
  disabled: boolean | undefined
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface DatePickerViewControlBindings
  extends CommonBindings, Part<"viewControl"> {
  "data-view": DatePickerDateView
}

export interface DatePickerHiddenInputBindings
  extends CommonBindings, Part<"hiddenInput"> {
  "aria-hidden": true
  "data-index": number
  disabled: boolean | undefined
  name: string | undefined
  onChange: JSX.ChangeEventHandler<HTMLInputElement>
  onFocus: JSX.FocusEventHandler
  readOnly: boolean
  required: boolean | undefined
  style: JSX.CSSProperties
  tabIndex: number
  type: "text"
  value: string
}

export interface DatePickerInputGroupBindings extends CommonBindings {
  "aria-describedby"?: string | undefined
  "aria-invalid"?: BooleanAriaAttr
  "data-invalid"?: BooleanDataAttr
}

/**
 * Bindings that turn the bordered field itself into the calendar trigger, used
 * in `multiple` mode where no text input owns focus.
 */
export interface DatePickerInputGroupTriggerBindings extends CommonBindings {
  "aria-controls": string
  "aria-disabled": BooleanAriaAttr
  "aria-expanded": boolean
  "aria-haspopup": "grid"
  "aria-invalid": BooleanAriaAttr
  "aria-label": string
  "aria-readonly": BooleanAriaAttr
  "aria-required": BooleanAriaAttr
  "data-disabled": BooleanDataAttr
  "data-placeholder-shown": BooleanDataAttr
  "data-placement": Placement | undefined
  "data-readonly": BooleanDataAttr
  "data-side": PlacementSide | undefined
  "data-state": "open" | "closed"
  id: string
  onClick: JSX.MouseEventHandler
  onKeyDown: JSX.KeyboardEventHandler<HTMLElement>
  role: "combobox"
  tabIndex: number
}

export interface DatePickerInputBindings extends CommonBindings, Part<"input"> {
  "aria-describedby": string | undefined
  "aria-invalid": BooleanAriaAttr
  autoComplete: "off"
  autoCorrect: "off"
  "data-index": number
  "data-invalid": BooleanDataAttr
  "data-placeholder-shown": BooleanDataAttr
  "data-state": "open" | "closed"
  defaultValue: string
  disabled: boolean | undefined
  id: string
  name: string | undefined
  onBeforeInput: JSX.FormEventHandler
  onBlur: JSX.FocusEventHandler
  onClick: JSX.MouseEventHandler
  onFocus: JSX.FocusEventHandler
  onInput: JSX.FormEventHandler
  onKeyDown: JSX.KeyboardEventHandler<HTMLInputElement>
  placeholder: string
  readOnly: boolean | undefined
  required: boolean | undefined
  spellCheck: "false"
}

export interface DatePickerPositionerBindings
  extends CommonBindings, Part<"positioner"> {
  id: string
  style: JSX.CSSProperties
}

export interface DatePickerPresetTriggerBindings
  extends CommonBindings, Part<"presetTrigger"> {
  "aria-label": string
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface DatePickerPresetsBindings
  extends CommonBindings, Part<"presets"> {
  hidden: boolean
}

export interface DatePickerPresetsTriggerBindings
  extends CommonBindings, Part<"presetsTrigger"> {
  "aria-label": string
  disabled: boolean | undefined
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface DatePickerViewCloseTriggerBindings
  extends CommonBindings, Part<"viewCloseTrigger"> {
  "aria-label": string
  disabled: boolean | undefined
  onClick: JSX.MouseEventHandler
  type: "button"
}

/** Re-exported types */

export type {DateDuration, DateRangePreset, DateValue, PositioningOptions}
