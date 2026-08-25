// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  DateFormatter,
  type DateValue,
  isEqualDay,
  isEqualMonth,
  isEqualYear,
  isSameDay,
  isToday,
  isWeekend,
  toCalendarDateTime,
} from "@internationalized/date"

import {
  getPlacementSide,
  getPlacementStyles,
} from "@qualcomm-ui/dom/floating-ui"
import {
  getEventKey,
  getNativeEvent,
  isComposingEvent,
  visuallyHiddenStyle,
} from "@qualcomm-ui/dom/query"
import {chunk} from "@qualcomm-ui/utils/array"
import {
  booleanAriaAttr,
  booleanDataAttr,
  mergeAriaIds,
} from "@qualcomm-ui/utils/attributes"
import {
  constrainValue,
  getDateRangePreset,
  getDayFormatter,
  getDaysInWeek,
  getDecadeRange,
  getDefaultYearRange,
  getMonthDays,
  getMonthFormatter,
  getMonthNames,
  getTodayDate,
  getUnitDuration,
  getWeekDays,
  getYearsRange,
  isDateEqual,
  isDateOutsideRange,
  isMonthOutsideRange,
  isDateUnavailable,
  isValidCharacter,
  ensureValidCharacters,
  getLocaleSeparator,
} from "@qualcomm-ui/utils/date-utils"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {
  EventKeyMap,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"
import {isValueWithinRange} from "@qualcomm-ui/utils/number"
import {compact} from "@qualcomm-ui/utils/object"

import {datePickerAnatomy} from "./date-picker.anatomy.js"
import type {
  DatePickerApi,
  DatePickerSchema,
  DatePickerApiDayTableCellProps,
  DatePickerDayTableCellState,
  DatePickerApiTableCellProps,
  DatePickerTableCellState,
  DatePickerTime,
} from "./date-picker.types.js"
import {
  adjustStartAndEndDate,
  clampView,
  defaultTranslations,
  getInputPlaceholder,
  getRoleDescription,
  isDateWithinRange,
} from "./date-picker.utils.js"
import {domEls, domIds, isInteractiveDescendantEvent} from "./internal/index.js"

export function createDatePickerApi(
  machine: Machine<DatePickerSchema>,
  normalize: PropNormalizer,
): DatePickerApi {
  const {computed, context, prop, scope, send, state} = machine

  const startValue = context.get("startValue")
  const endValue = computed("endValue")
  const selectedValue = context.get("value")
  const focusedValue = context.get("focusedValue")

  const hoveredValue = context.get("hoveredValue")
  const anchorIndex = context.get("activeIndex") === 0 ? 1 : 0
  const hoveredRangeValue = hoveredValue
    ? adjustStartAndEndDate([selectedValue[anchorIndex], hoveredValue])
    : []

  const disabled = computed("disabled")
  const readOnly = Boolean(prop("readOnly"))
  const invalid = Boolean(prop("invalid"))
  const interactive = computed("isInteractive")

  const empty = selectedValue.every((date) => date == null)

  const min = prop("min")
  const max = prop("max")
  const locale = prop("locale")
  const timeZone = prop("timeZone")
  const startOfWeek = prop("startOfWeek")

  const focused = state.matches("focused")
  const open = state.matches("open")
  const presetsOpen = context.get("presetsOpen")

  const isRangePicker = prop("selectionMode") === "range"
  const isMultiPicker = prop("selectionMode") === "multiple"
  const isDateUnavailableFn = prop("isDateUnavailable")
  const maxSelectedDates = prop("maxSelectedDates")
  const isMaxSelected =
    isMultiPicker &&
    maxSelectedDates != null &&
    selectedValue.length >= maxSelectedDates

  const currentPlacement = context.get("currentPlacement")
  const currentPlacementSide = currentPlacement
    ? getPlacementSide(currentPlacement)
    : undefined
  const popperStyles = getPlacementStyles({
    ...prop("positioning"),
    placement: currentPlacement,
  })

  const separator = getLocaleSeparator(locale!)
  const translations = {
    ...defaultTranslations,
    ...compact(prop("translations")),
  }
  const inputFormat = getInputPlaceholder(locale!)

  const dayFormatter = getDayFormatter(locale!, timeZone!, focusedValue)
  const monthFormatter = getMonthFormatter(locale!, timeZone!, focusedValue)
  const unitDuration = getUnitDuration(computed("visibleDuration"))

  const triggerLabel = translations.trigger({
    open,
    selectionMode: prop("selectionMode")!,
    valueText: selectedValue.map((date) =>
      date ? dayFormatter.format(date.toDate(timeZone!)) : undefined,
    ),
  })

  function getMonthWeeks(from = startValue) {
    const numOfWeeks = prop("fixedWeeks") ? 6 : undefined
    return getMonthDays(from, locale!, numOfWeeks, startOfWeek)
  }

  function getMonths(props: {format?: "short" | "long" | undefined} = {}) {
    const {format} = props
    return getMonthNames(locale!, format, focusedValue).map((label, index) => {
      const value = index + 1
      const dateValue = focusedValue.set({month: value})
      const disabled = isMonthOutsideRange(dateValue, min, max)
      return {disabled, label, value}
    })
  }

  function getYears() {
    const defaultRange = getDefaultYearRange(focusedValue, min, max)
    const range = getYearsRange(defaultRange)
    return range.map((year) => ({
      disabled: !isValueWithinRange(
        year,
        min?.year as number,
        max?.year as number,
      ),
      label: year.toString(),
      value: year,
    }))
  }

  function isUnavailable(date: DateValue) {
    return isDateUnavailable(date, isDateUnavailableFn, locale!, min, max)
  }

  function focusMonth(month: number) {
    const date = startValue ?? getTodayDate(timeZone, focusedValue.calendar)
    send({type: "FOCUS.SET", value: date.set({month})})
  }

  function focusYear(year: number) {
    const date = startValue ?? getTodayDate(timeZone, focusedValue.calendar)
    send({type: "FOCUS.SET", value: date.set({year})})
  }

  function getYearTableCellState(
    props: DatePickerApiTableCellProps,
  ): DatePickerTableCellState {
    const {disabled: disabledProp, value} = props
    const dateValue = focusedValue.set({year: value})

    const decadeYears = getDecadeRange(startValue.year, {strict: true})
    const isOutsideVisibleRange = !decadeYears.includes(value)
    const isWithinMinMax = isValueWithinRange(value, min?.year, max?.year)

    const isInSelectedRange =
      isRangePicker && isDateWithinRange(dateValue, selectedValue)
    const isFirstInSelectedRange =
      isRangePicker &&
      !!selectedValue[0] &&
      isEqualYear(dateValue, selectedValue[0])
    const isLastInSelectedRange =
      isRangePicker &&
      !!selectedValue[1] &&
      isEqualYear(dateValue, selectedValue[1])

    const hasHoveredRange = isRangePicker && hoveredRangeValue.length > 0
    const isInHoveredRange =
      hasHoveredRange && isDateWithinRange(dateValue, hoveredRangeValue)
    const isFirstInHoveredRange =
      hasHoveredRange &&
      !!hoveredRangeValue[0] &&
      isEqualYear(dateValue, hoveredRangeValue[0])
    const isLastInHoveredRange =
      hasHoveredRange &&
      !!hoveredRangeValue[1] &&
      isEqualYear(dateValue, hoveredRangeValue[1])

    const cellState = {
      get disabled() {
        return disabled || disabledProp || !cellState.selectable
      },
      firstInHoveredRange: isFirstInHoveredRange,
      firstInRange: isFirstInSelectedRange,
      focused: focusedValue.year === props.value,
      inHoveredRange: isInHoveredRange,
      inRange: isInSelectedRange || isInHoveredRange,
      lastInHoveredRange: isLastInHoveredRange,
      lastInRange: isLastInSelectedRange,
      outsideRange: isOutsideVisibleRange,
      selectable: !isOutsideVisibleRange && isWithinMinMax,
      selected: !!selectedValue.find((date) => date && date.year === value),
      value: dateValue,
      valueText: value.toString(),
    }
    return cellState
  }

  function getMonthTableCellState(
    props: DatePickerApiTableCellProps,
  ): DatePickerTableCellState {
    const {disabled: disabledProp, value} = props
    const dateValue = focusedValue.set({month: value})

    const isInSelectedRange =
      isRangePicker && isDateWithinRange(dateValue, selectedValue)
    const isFirstInSelectedRange =
      isRangePicker &&
      !!selectedValue[0] &&
      isEqualMonth(dateValue, selectedValue[0])
    const isLastInSelectedRange =
      isRangePicker &&
      !!selectedValue[1] &&
      isEqualMonth(dateValue, selectedValue[1])

    const hasHoveredRange = isRangePicker && hoveredRangeValue.length > 0
    const isInHoveredRange =
      hasHoveredRange && isDateWithinRange(dateValue, hoveredRangeValue)
    const isFirstInHoveredRange =
      hasHoveredRange &&
      !!hoveredRangeValue[0] &&
      isEqualMonth(dateValue, hoveredRangeValue[0])
    const isLastInHoveredRange =
      hasHoveredRange &&
      !!hoveredRangeValue[1] &&
      isEqualMonth(dateValue, hoveredRangeValue[1])

    const cellState = {
      get disabled() {
        return disabled || disabledProp || !cellState.selectable
      },
      firstInHoveredRange: isFirstInHoveredRange,
      firstInRange: isFirstInSelectedRange,
      focused: focusedValue.month === props.value,
      inHoveredRange: isInHoveredRange,
      inRange: isInSelectedRange || isInHoveredRange,
      lastInHoveredRange: isLastInHoveredRange,
      lastInRange: isLastInSelectedRange,
      outsideRange: false,
      selectable: !isMonthOutsideRange(dateValue, min, max),
      selected: !!selectedValue.find(
        (date) =>
          date && date.month === value && date.year === focusedValue.year,
      ),
      value: dateValue,
      valueText: monthFormatter.format(dateValue.toDate(timeZone!)),
    }
    return cellState
  }

  function getDayTableCellState(
    props: DatePickerApiDayTableCellProps,
  ): DatePickerDayTableCellState {
    const {
      disabled: disabledProp,
      value,
      visibleRange = computed("visibleRange"),
    } = props

    const outsideDaySelectable = prop("outsideDaySelectable")

    const end = visibleRange.start.add(unitDuration).subtract({days: 1})
    const isOutsideRange = isDateOutsideRange(value, visibleRange.start, end)

    // Check if max number of dates has been reached (for multiple selection mode)
    const isSelected = selectedValue.some(
      (date) => date != null && isSameDay(value, date),
    )

    // Calculate range states
    const isInSelectedRange =
      isRangePicker && isDateWithinRange(value, selectedValue)
    const isFirstInSelectedRange =
      isRangePicker && isDateEqual(value, selectedValue[0])
    const isLastInSelectedRange =
      isRangePicker && isDateEqual(value, selectedValue[1])

    // Calculate hover range states
    const hasHoveredRange = isRangePicker && hoveredRangeValue.length > 0
    const isInHoveredRange =
      hasHoveredRange && isDateWithinRange(value, hoveredRangeValue)
    const isFirstInHoveredRange =
      hasHoveredRange && isDateEqual(value, hoveredRangeValue[0])
    const isLastInHoveredRange =
      hasHoveredRange && isDateEqual(value, hoveredRangeValue[1])

    const cellState = {
      disabled:
        disabled ||
        disabledProp ||
        (!outsideDaySelectable && isOutsideRange) ||
        isDateOutsideRange(value, min, max) ||
        // Disable unselected dates when max is reached in multiple selection mode
        (isMaxSelected && !isSelected),
      firstInHoveredRange: isFirstInHoveredRange,
      firstInRange: isFirstInSelectedRange,
      get focused() {
        return !!(
          isDateEqual(value, focusedValue) &&
          (!cellState.outsideRange || outsideDaySelectable)
        )
      },
      // Preview range states
      inHoveredRange: isInHoveredRange,
      // Range states
      inRange: isInSelectedRange || isInHoveredRange,
      invalid: isDateOutsideRange(value, min, max),
      lastInHoveredRange: isLastInHoveredRange,
      lastInRange: isLastInSelectedRange,

      outsideRange: isOutsideRange,
      get selectable() {
        return !cellState.disabled && !cellState.unavailable
      },
      selected: isSelected,

      today: isToday(value, timeZone!),
      unavailable:
        isDateUnavailable(value, isDateUnavailableFn, locale!, min, max) &&
        !disabledProp,
      value,
      valueText: dayFormatter.format(value.toDate(timeZone!)),
      weekend: isWeekend(value, locale!),
    }

    return cellState
  }

  const commonProps: {dir: Direction | undefined} = {
    dir: prop("dir"),
  }

  const parts = datePickerAnatomy.parts

  return {
    cancel() {
      send({type: "CANCEL"})
    },
    clearValue(options = {}) {
      const {focus = true} = options
      send({focus, type: "VALUE.CLEAR"})
    },
    disabled,
    focused,
    focusedValue,
    focusedValueAsDate: focusedValue?.toDate(timeZone!),
    focusedValueAsString: prop("format")!(focusedValue, {
      locale: locale!,
      timeZone: timeZone!,
    }),
    focusMonth,
    focusYear,
    format(value, opts = {month: "long", year: "numeric"}) {
      return new DateFormatter(locale!, {
        ...opts,
        calendar: value.calendar.identifier,
        timeZone: opts.timeZone ?? timeZone!,
      }).format(value.toDate(timeZone!))
    },
    getDaysInWeek(week, from = startValue) {
      return getDaysInWeek(week, from, locale!, startOfWeek)
    },
    getDayTableCellState,
    getDecade() {
      const years = getDecadeRange(startValue.year, {strict: true})
      return {end: years.at(-1), start: years.at(0)}
    },
    getMonths,
    getMonthsGrid(props = {}) {
      const {columns = 1, format} = props
      return chunk(getMonths({format}), columns)
    },
    getMonthTableCellState,
    getMonthWeeks,
    getOffset(duration) {
      const from = startValue.add(duration)
      const end = endValue.add(duration)
      return {
        visibleRange: {end, start: from},
        visibleRangeText: {
          end: monthFormatter.format(end.toDate(timeZone!)),
          start: monthFormatter.format(from.toDate(timeZone!)),
        },
        weeks: getMonthWeeks(from),
      }
    },
    getRangePresetValue(preset) {
      return getDateRangePreset(preset, locale!, timeZone!)
    },
    getYears,
    getYearsGrid(props = {}) {
      const {columns = 1} = props
      const years = getDecadeRange(startValue.year, {strict: true}).map(
        (year) => ({
          disabled: !isValueWithinRange(
            year,
            min?.year as number,
            max?.year as number,
          ),
          label: year.toString(),
          value: year,
        }),
      )
      return chunk(years, columns)
    },
    getYearTableCellState,
    goToNext() {
      send({type: "GOTO.NEXT", view: context.get("view")})
    },
    goToPrev() {
      send({type: "GOTO.PREV", view: context.get("view")})
    },
    inline: !!prop("inline"),
    invalid,
    isMaxSelected,
    isUnavailable,
    maxSelectedDates,
    numOfMonths: prop("numOfMonths")!,
    open,
    presetsOpen,
    readOnly,
    selectionMode: prop("selectionMode")!,
    selectToday() {
      const value = constrainValue(
        getTodayDate(timeZone, focusedValue.calendar),
        min,
        max,
      )
      send({type: "VALUE.SET", value: [value]})
    },
    setFocusedValue(value) {
      send({type: "FOCUS.SET", value})
    },
    setOpen(nextOpen) {
      if (prop("inline")) {
        return
      }
      const open = state.matches("open")
      if (open === nextOpen) {
        return
      }
      send({type: nextOpen ? "OPEN" : "CLOSE"})
    },
    setTime(time: DatePickerTime, index = 0) {
      const values = Array.from(selectedValue)
      let dateValue = values[index]
      if (!dateValue) {
        return
      }

      // Convert CalendarDate to CalendarDateTime/ZonedDateTime if needed
      if (!("hour" in dateValue)) {
        dateValue = toCalendarDateTime(dateValue)
      }

      // Set time components
      dateValue = dateValue.set({
        hour: time.hour ?? ("hour" in dateValue ? dateValue.hour : 0),
        millisecond:
          time.millisecond ??
          ("millisecond" in dateValue ? dateValue.millisecond : 0),
        minute: time.minute ?? ("minute" in dateValue ? dateValue.minute : 0),
        second: time.second ?? ("second" in dateValue ? dateValue.second : 0),
      })

      values[index] = constrainValue(dateValue, min, max)
      send({type: "VALUE.SET", value: values})
    },
    setValue(values) {
      const computedValue = values.map((date) =>
        date == null ? date : constrainValue(date, min, max),
      )
      send({type: "VALUE.SET", value: computedValue})
    },
    setView(view) {
      send({type: "VIEW.SET", view})
    },
    toggleValue(value) {
      if (!interactive) {
        return
      }
      send({type: "VALUE.TOGGLE", value: constrainValue(value, min, max)})
    },
    value: selectedValue,
    valueAsDate: selectedValue.map((date) =>
      date == null ? null : date.toDate(timeZone!),
    ),
    valueAsString: computed("valueAsString"),
    view: context.get("view"),
    visibleRange: computed("visibleRange"),
    visibleRangeText: computed("visibleRangeText"),
    get weekDays() {
      return getWeekDays(startValue, startOfWeek, timeZone!, locale!)
    },
    get weeks() {
      return getMonthWeeks()
    },

    // group: bindings getters

    getClearTriggerBindings(props) {
      scope.ids.register("clearTrigger", props)
      return normalize.button({
        ...commonProps,
        "aria-label": translations.clearTrigger,
        ...parts.clearTrigger,
        disabled,
        hidden: !selectedValue.length,
        id: props.id,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          send({type: "VALUE.CLEAR"})
        },
        type: "button",
      })
    },
    getContentBindings(props) {
      scope.ids.register("content", props)
      return normalize.element({
        ...commonProps,
        "aria-label": translations.content,
        "aria-roledescription": "datepicker",
        "data-inline": booleanDataAttr(prop("inline")),
        ...parts.content,
        "data-placement": currentPlacement!,
        "data-presets-open": booleanDataAttr(presetsOpen),
        "data-side": currentPlacementSide,
        "data-state": open ? "open" : "closed",
        hidden: !open,
        id: props.id,
        role: prop("inline") ? "group" : "dialog",
        tabIndex: -1,
      })
    },
    getControlBindings(props) {
      scope.ids.register("control", props)
      return normalize.element({
        ...commonProps,
        "data-disabled": booleanDataAttr(disabled),
        ...parts.control,
        "data-placeholder-shown": booleanDataAttr(empty),
        id: props.id,
      })
    },
    getDayTableCellBindings(props) {
      const cellState = getDayTableCellState(props)
      return normalize.element({
        ...commonProps,
        "aria-current": cellState.today ? "date" : undefined,
        "aria-disabled": booleanAriaAttr(!cellState.selectable),
        "aria-invalid": booleanAriaAttr(cellState.invalid),
        "aria-selected": cellState.selected || cellState.inRange,
        ...parts.tableCell,
        "data-value": props.value.toString(),
        role: "gridcell",
      })
    },
    getDayTableCellTriggerBindings(props) {
      const cellState = getDayTableCellState(props)
      const {value} = props
      return normalize.element({
        ...commonProps,
        "aria-disabled": booleanAriaAttr(!cellState.selectable),
        "aria-invalid": booleanAriaAttr(cellState.invalid),
        "aria-label": translations.dayCell(cellState),
        "data-disabled": booleanDataAttr(!cellState.selectable),
        "data-focus": booleanDataAttr(cellState.focused),
        "data-hover-range-end": booleanDataAttr(cellState.lastInHoveredRange),
        "data-hover-range-start": booleanDataAttr(
          cellState.firstInHoveredRange,
        ),
        "data-in-hover-range": booleanDataAttr(cellState.inHoveredRange),
        "data-in-range": booleanDataAttr(cellState.inRange),
        "data-outside-range": booleanDataAttr(cellState.outsideRange),
        ...parts.tableCellTrigger,
        "data-range-end": booleanDataAttr(cellState.lastInRange),
        "data-range-start": booleanDataAttr(cellState.firstInRange),
        "data-selectable": booleanDataAttr(cellState.selectable),
        "data-selected": booleanDataAttr(cellState.selected),
        "data-today": booleanDataAttr(cellState.today),
        "data-unavailable": booleanDataAttr(cellState.unavailable),
        "data-value": value.toString(),
        "data-view": "day",
        "data-weekend": booleanDataAttr(cellState.weekend),
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          if (!cellState.selectable) {
            return
          }
          send({cell: "day", type: "CELL.CLICK", value})
        },
        onPointerMove: isRangePicker
          ? (event) => {
              if (event.pointerType === "touch") {
                return
              }
              if (!cellState.selectable) {
                return
              }
              const focus =
                (event.currentTarget as Node)?.ownerDocument?.activeElement !==
                event.currentTarget
              if (hoveredValue && isEqualDay(value, hoveredValue)) {
                return
              }
              send({
                cell: "day",
                focus,
                outsideRange: cellState.outsideRange,
                type: "CELL.POINTER_MOVE",
                value,
              })
            }
          : undefined,
        role: "button",
        tabIndex: disabled ? -1 : cellState.focused ? 0 : -1,
      })
    },
    getErrorIndicatorBindings() {
      return normalize.element({
        ...parts.errorIndicator,
        "aria-label": translations.errorIndicator,
        hidden: !invalid,
      })
    },
    getErrorTextBindings(props) {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...parts.errorText,
        "aria-live": "polite",
        hidden: !invalid,
        id: domIds.errorText(scope),
      })
    },
    getHiddenInputBindings(props) {
      const {index = 0, value} = props
      return normalize.input({
        ...commonProps,
        ...parts.hiddenInput,
        "aria-hidden": true,
        "data-index": index,
        disabled,
        name: prop("name"),
        onChange() {},
        onFocus() {
          domEls.trigger(scope)?.focus({preventScroll: true})
        },
        readOnly,
        required: index === 0 ? prop("required") : undefined,
        style: visuallyHiddenStyle,
        tabIndex: -1,
        type: "text",
        value: value ?? "",
      })
    },
    getHintBindings(props) {
      scope.ids.register("hint", props)
      return normalize.element({
        ...parts.hint,
        "data-disabled": booleanDataAttr(disabled),
        hidden: invalid,
        id: domIds.hint(scope),
      })
    },
    getInputBindings(props) {
      const {fixOnBlur = true, index = 0} = props
      scope.ids
        .collection("input")
        .register(index.toString(), props.id, props.onDestroy)

      return normalize.input({
        ...commonProps,
        "aria-describedby": mergeAriaIds(
          invalid ? undefined : domIds.hint(scope),
          invalid ? domIds.errorText(scope) : undefined,
        ),
        "aria-description": translations.inputDescription(inputFormat),
        "aria-invalid": booleanAriaAttr(invalid),
        "aria-label": isRangePicker
          ? index === 0
            ? translations.rangeInputStart
            : translations.rangeInputEnd
          : undefined,
        autoComplete: "off",
        autoCorrect: "off",
        "data-index": index,
        ...parts.input,
        "data-invalid": booleanDataAttr(invalid),
        "data-placeholder-shown": booleanDataAttr(empty),
        "data-state": open ? "open" : "closed",
        defaultValue: computed("valueAsString")[index] ?? "",
        disabled,
        id: props.id,
        name: prop("name"),
        onBeforeInput(event) {
          const {data} = getNativeEvent(event)
          if (!isValidCharacter(data, separator)) {
            event.preventDefault()
          }
        },
        onBlur(event) {
          const value = (event.currentTarget as HTMLInputElement)?.value.trim()
          send({fixOnBlur, index, type: "INPUT.BLUR", value})
        },
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!prop("openOnClick")) {
            return
          }
          if (!interactive) {
            return
          }
          send({src: "input.click", type: "OPEN"})
        },
        onFocus() {
          send({index, type: "INPUT.FOCUS"})
        },
        onInput(event) {
          const value = (event.currentTarget as HTMLInputElement)?.value
          send({
            index,
            type: "INPUT.CHANGE",
            value: ensureValidCharacters(value, separator),
          })
        },
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          const keyMap: EventKeyMap<HTMLInputElement> = {
            Enter(event) {
              // TODO: consider form submission (with enter key)
              if (isComposingEvent(event)) {
                return
              }
              if (event.currentTarget?.value.trim() === "") {
                return
              }
              send({
                index,
                type: "INPUT.ENTER",
                value: event.currentTarget?.value,
              })
            },
          }

          const exec = keyMap[event.key]
          if (exec) {
            exec(event)
            event.preventDefault()
          }
        },
        placeholder: prop("placeholder") || inputFormat,
        readOnly,
        required: prop("required"),
        spellCheck: "false",
      })
    },
    getInputGroupBindings() {
      if (!isMultiPicker) {
        return normalize.element({...commonProps})
      }
      return normalize.element({
        ...commonProps,
        "aria-describedby": mergeAriaIds(
          domIds.hint(scope),
          invalid ? domIds.errorText(scope) : undefined,
        ),
        "aria-invalid": booleanAriaAttr(invalid),
        "data-invalid": booleanDataAttr(invalid),
      })
    },
    getInputGroupTriggerBindings(props) {
      scope.ids.register("trigger", props)
      return normalize.element({
        ...commonProps,
        "aria-controls": domIds.content(scope),
        "aria-disabled": booleanAriaAttr(disabled),
        "aria-expanded": open,
        "aria-haspopup": "dialog",
        "aria-invalid": booleanAriaAttr(invalid),
        "aria-label": triggerLabel,
        "aria-readonly": booleanAriaAttr(readOnly),
        "aria-required": booleanAriaAttr(prop("required")),
        "data-disabled": booleanDataAttr(disabled),
        "data-placeholder-shown": booleanDataAttr(empty),
        "data-placement": currentPlacement,
        "data-readonly": booleanDataAttr(readOnly),
        "data-side": currentPlacementSide,
        "data-state": open ? "open" : "closed",
        id: props.id,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          // tags and the clear button own their own clicks
          if (isInteractiveDescendantEvent(event)) {
            return
          }
          send({type: "TRIGGER.CLICK"})
        },
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          if (event.target !== event.currentTarget) {
            return
          }

          const keyMap: EventKeyMap = {
            ArrowDown() {
              send({src: "input-group-trigger", type: "OPEN"})
            },
            Enter() {
              send({type: "TRIGGER.CLICK"})
            },
            Space() {
              send({type: "TRIGGER.CLICK"})
            },
          }

          const exec = keyMap[getEventKey(event, {dir: prop("dir")})]
          if (exec) {
            exec(event)
            event.preventDefault()
          }
        },
        role: "combobox",
        tabIndex: disabled ? -1 : 0,
      })
    },
    getLabelBindings(props = {}) {
      const {index = 0} = props
      const idx = index.toString()
      return normalize.label({
        ...commonProps,
        "data-disabled": booleanDataAttr(disabled),
        "data-index": index,
        ...parts.label,
        "data-readonly": booleanDataAttr(readOnly),
        "data-state": open ? "open" : "closed",
        htmlFor: isMultiPicker ? undefined : domIds.input(scope, idx),
        // no input to associate with, so stand in for native label behavior
        onClick: isMultiPicker
          ? (event) => {
              if (event.defaultPrevented || disabled) {
                return
              }
              domEls.trigger(scope)?.focus({preventScroll: true})
            }
          : undefined,
      })
    },
    getMonthTableCellBindings(props) {
      const cellState = getMonthTableCellState(props)
      return normalize.element({
        ...commonProps,
        "aria-disabled": booleanAriaAttr(!cellState.selectable),
        "aria-selected": booleanAriaAttr(
          cellState.selected || cellState.inRange,
        ),
        colSpan: props.columns,
        ...parts.tableCell,
        "data-selected": booleanDataAttr(cellState.selected),
        "data-value": props.value,
        role: "gridcell",
      })
    },
    getMonthTableCellTriggerBindings(props) {
      const cellState = getMonthTableCellState(props)
      const {value} = props
      return normalize.element({
        ...commonProps,
        "aria-disabled": booleanAriaAttr(!cellState.selectable),
        "aria-label": cellState.valueText,
        "data-disabled": booleanDataAttr(!cellState.selectable),
        "data-focus": booleanDataAttr(cellState.focused),
        "data-hover-range-end": booleanDataAttr(cellState.lastInHoveredRange),
        "data-hover-range-start": booleanDataAttr(
          cellState.firstInHoveredRange,
        ),
        "data-in-hover-range": booleanDataAttr(cellState.inHoveredRange),
        "data-in-range": booleanDataAttr(cellState.inRange),
        ...parts.tableCellTrigger,
        "data-outside-range": booleanDataAttr(cellState.outsideRange),
        "data-range-end": booleanDataAttr(cellState.lastInRange),
        "data-range-start": booleanDataAttr(cellState.firstInRange),
        "data-selectable": booleanDataAttr(cellState.selectable),
        "data-selected": booleanDataAttr(cellState.selected),
        "data-value": value,
        "data-view": "month",
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          if (!cellState.selectable) {
            return
          }
          send({cell: "month", type: "CELL.CLICK", value})
        },
        onPointerMove: isRangePicker
          ? (event) => {
              if (event.pointerType === "touch") {
                return
              }
              if (!cellState.selectable) {
                return
              }
              const focus =
                (event.currentTarget as Node)?.ownerDocument?.activeElement !==
                event.currentTarget
              if (
                hoveredValue &&
                cellState.value &&
                isEqualMonth(cellState.value, hoveredValue)
              ) {
                return
              }
              send({
                cell: "month",
                focus,
                type: "CELL.POINTER_MOVE",
                value: cellState.value,
              })
            }
          : undefined,
        role: "button",
        tabIndex: disabled ? -1 : cellState.focused ? 0 : -1,
      })
    },
    getNextTriggerBindings(props = {}) {
      const {view = "day"} = props
      const isDisabled =
        disabled || presetsOpen || !computed("isNextVisibleRangeValid")
      return normalize.button({
        ...commonProps,
        "aria-label": translations.nextTrigger(view),
        "data-disabled": booleanDataAttr(isDisabled),
        ...parts.nextTrigger,
        disabled: isDisabled,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({type: "GOTO.NEXT", view})
        },
        type: "button",
      })
    },
    getPositionerBindings(props) {
      scope.ids.register("positioner", props)
      return normalize.element({
        ...commonProps,
        ...parts.positioner,
        id: props.id,
        style: popperStyles.floating,
      })
    },
    getPresetsBindings() {
      return normalize.element({
        ...commonProps,
        ...parts.presets,
        hidden: !presetsOpen,
      })
    },
    getPresetsTriggerBindings() {
      return normalize.button({
        ...commonProps,
        "aria-label": translations.presetsTrigger(presetsOpen),
        ...parts.presetsTrigger,
        disabled: disabled || undefined,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          send({type: "PRESET.TOGGLE"})
        },
        type: "button",
      })
    },
    getPresetTriggerBindings(props) {
      const value = Array.isArray(props.value)
        ? props.value
        : getDateRangePreset(props.value, locale!, timeZone!)
      const valueAsString = value
        .filter((item) => item != null)
        .map((item) => dayFormatter.format(item.toDate(timeZone!)))
      return normalize.button({
        ...commonProps,
        "aria-label": translations.presetTrigger(valueAsString),
        ...parts.presetTrigger,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          send({type: "PRESET.CLICK", value})
        },
        type: "button",
      })
    },
    getPrevTriggerBindings(props = {}) {
      const {view = "day"} = props
      const isDisabled =
        disabled || presetsOpen || !computed("isPrevVisibleRangeValid")
      return normalize.button({
        ...commonProps,
        "aria-label": translations.prevTrigger(view),
        "data-disabled": booleanDataAttr(isDisabled),
        ...parts.prevTrigger,
        disabled: isDisabled,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({type: "GOTO.PREV", view})
        },
        type: "button",
      })
    },
    getRangeTextBindings() {
      return normalize.element({
        ...commonProps,
        ...parts.rangeText,
      })
    },
    getRootBindings() {
      return normalize.element({
        ...commonProps,
        "data-disabled": booleanDataAttr(disabled),
        ...parts.root,
        "data-empty": booleanDataAttr(empty),
        "data-readonly": booleanDataAttr(readOnly),
        "data-state": open ? "open" : "closed",
      })
    },
    getTableBindings(props = {}) {
      const {view = "day", columns = view === "day" ? 7 : 4} = props
      return normalize.element({
        ...commonProps,
        "aria-disabled": booleanAriaAttr(disabled),
        "aria-label": computed("visibleRangeText").formatted,
        "aria-multiselectable": booleanAriaAttr(
          prop("selectionMode") !== "single",
        ),
        "aria-readonly": booleanAriaAttr(readOnly),
        "aria-roledescription": getRoleDescription(view),
        "data-columns": columns,
        ...parts.table,
        "data-view": view,
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          // readOnly still allows roving-focus navigation
          if (disabled) {
            return
          }

          const selectFocusedCell = () => {
            if (!interactive) {
              return
            }
            if (view === "day" && isUnavailable(focusedValue)) {
              return
            }
            if (view === "month") {
              const cellState = getMonthTableCellState({
                value: focusedValue.month,
              })
              if (!cellState.selectable) {
                return
              }
            }
            if (view === "year") {
              const cellState = getYearTableCellState({
                value: focusedValue.year,
              })
              if (!cellState.selectable) {
                return
              }
            }
            send({columns, focus: true, type: "TABLE.ENTER", view})
          }

          const keyMap: EventKeyMap = {
            ArrowDown() {
              send({columns, focus: true, type: "TABLE.ARROW_DOWN", view})
            },
            ArrowLeft() {
              send({columns, focus: true, type: "TABLE.ARROW_LEFT", view})
            },
            ArrowRight() {
              send({columns, focus: true, type: "TABLE.ARROW_RIGHT", view})
            },
            ArrowUp() {
              send({columns, focus: true, type: "TABLE.ARROW_UP", view})
            },
            End() {
              send({columns, focus: true, type: "TABLE.END", view})
            },
            Enter: selectFocusedCell,
            Home() {
              send({columns, focus: true, type: "TABLE.HOME", view})
            },
            PageDown(event) {
              send({
                columns,
                focus: true,
                larger: event.shiftKey,
                type: "TABLE.PAGE_DOWN",
                view,
              })
            },
            PageUp(event) {
              send({
                columns,
                focus: true,
                larger: event.shiftKey,
                type: "TABLE.PAGE_UP",
                view,
              })
            },
            Space: selectFocusedCell,
          }

          const exec =
            keyMap[
              getEventKey(event, {
                dir: prop("dir"),
              })
            ]

          if (exec) {
            exec(event)
            event.preventDefault()
            event.stopPropagation()
          }
        },
        onPointerDown() {
          send({type: "TABLE.POINTER_DOWN", view})
        },
        onPointerLeave() {
          send({type: "TABLE.POINTER_LEAVE"})
        },
        onPointerUp() {
          send({type: "TABLE.POINTER_UP", view})
        },
        role: "grid",
        tabIndex: -1,
      })
    },
    getTableBodyBindings(props = {}) {
      const {view = "day"} = props
      return normalize.element({
        ...commonProps,
        "data-disabled": booleanDataAttr(disabled),
        ...parts.tableBody,
        "data-view": view,
      })
    },
    getTableHeadBindings(props = {}) {
      const {view = "day"} = props
      return normalize.element({
        ...commonProps,
        "data-disabled": booleanDataAttr(disabled),
        ...parts.tableHead,
        "data-view": view,
      })
    },
    getTableHeaderBindings(props = {}) {
      const {view = "day"} = props
      return normalize.element({
        ...commonProps,
        "data-disabled": booleanDataAttr(disabled),
        ...parts.tableHeader,
        "data-view": view,
      })
    },
    getTableRowBindings(props = {}) {
      const {view = "day"} = props
      return normalize.element({
        ...commonProps,
        "aria-disabled": booleanAriaAttr(disabled),
        "data-disabled": booleanDataAttr(disabled),
        ...parts.tableRow,
        "data-view": view,
      })
    },
    getTriggerBindings(props) {
      scope.ids.register("trigger", props)
      return normalize.button({
        ...commonProps,
        "aria-controls": domIds.content(scope),
        "aria-expanded": open,
        "aria-haspopup": "dialog",
        "aria-label": triggerLabel,
        ...parts.trigger,
        "data-placeholder-shown": booleanDataAttr(empty),
        "data-placement": currentPlacement,
        "data-side": currentPlacementSide,
        "data-state": open ? "open" : "closed",
        disabled,
        id: props.id,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          send({type: "TRIGGER.CLICK"})
        },
        type: "button",
      })
    },
    getViewBindings(props = {}) {
      const {view = "day"} = props
      return normalize.element({
        ...commonProps,
        ...parts.view,
        "data-view": view,
        hidden: context.get("view") !== view,
        role: "application",
      })
    },
    getViewCloseTriggerBindings() {
      const baseView = prop("minView")!
      return normalize.button({
        ...commonProps,
        "aria-label": translations.viewCloseTrigger,
        ...parts.viewCloseTrigger,
        disabled: disabled || undefined,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          send({type: "VIEW.SET", view: baseView})
        },
        type: "button",
      })
    },
    getViewControlBindings(props = {}) {
      const {view = "day"} = props
      return normalize.element({
        ...commonProps,
        ...parts.viewControl,
        "data-view": view,
      })
    },
    getViewTriggerBindings(props = {}) {
      const {goToView, view = "day"} = props
      const unreachableView =
        goToView != null &&
        clampView(goToView, prop("minView"), prop("maxView")) !== goToView
      return normalize.button({
        ...commonProps,
        "aria-label": translations.viewTrigger(view, goToView),
        ...parts.viewTrigger,
        "data-view": goToView ?? view,
        disabled: disabled || presetsOpen || unreachableView,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          if (goToView) {
            send({type: "VIEW.SET", view: goToView})
          } else {
            send({src: "viewTrigger", type: "VIEW.TOGGLE"})
          }
        },
        type: "button",
      })
    },
    getYearTableCellBindings(props) {
      const cellState = getYearTableCellState(props)
      return normalize.element({
        ...commonProps,
        "aria-disabled": booleanAriaAttr(!cellState.selectable),
        "aria-selected": booleanAriaAttr(cellState.selected),
        colSpan: props.columns,
        ...parts.tableCell,
        "data-selected": booleanDataAttr(cellState.selected),
        "data-value": props.value,
        role: "gridcell",
      })
    },
    getYearTableCellTriggerBindings(props) {
      const cellState = getYearTableCellState(props)
      const {value} = props
      return normalize.element({
        ...commonProps,
        "aria-disabled": booleanAriaAttr(!cellState.selectable),
        "aria-label": cellState.valueText,
        "data-disabled": booleanDataAttr(!cellState.selectable),
        "data-focus": booleanDataAttr(cellState.focused),
        "data-hover-range-end": booleanDataAttr(cellState.lastInHoveredRange),
        "data-hover-range-start": booleanDataAttr(
          cellState.firstInHoveredRange,
        ),
        "data-in-hover-range": booleanDataAttr(cellState.inHoveredRange),
        "data-in-range": booleanDataAttr(cellState.inRange),
        ...parts.tableCellTrigger,
        "data-outside-range": booleanDataAttr(cellState.outsideRange),
        "data-range-end": booleanDataAttr(cellState.lastInRange),
        "data-range-start": booleanDataAttr(cellState.firstInRange),
        "data-selectable": booleanDataAttr(cellState.selectable),
        "data-selected": booleanDataAttr(cellState.selected),
        "data-value": value,
        "data-view": "year",
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          if (!cellState.selectable) {
            return
          }
          send({cell: "year", type: "CELL.CLICK", value})
        },
        onPointerMove: isRangePicker
          ? (event) => {
              if (event.pointerType === "touch") {
                return
              }
              if (!cellState.selectable) {
                return
              }
              const focus =
                (event.currentTarget as Node)?.ownerDocument?.activeElement !==
                event.currentTarget
              if (
                hoveredValue &&
                cellState.value &&
                isEqualYear(cellState.value, hoveredValue)
              ) {
                return
              }
              send({
                cell: "year",
                focus,
                type: "CELL.POINTER_MOVE",
                value: cellState.value,
              })
            }
          : undefined,
        role: "button",
        tabIndex: disabled ? -1 : cellState.focused ? 0 : -1,
      })
    },
  }
}
