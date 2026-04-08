// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  getPlacementStyles,
  type PositioningOptions,
} from "@qualcomm-ui/dom/floating-ui"
import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {
  getEventKey,
  getEventTarget,
  isEditableElement,
  isSelfTarget,
} from "@qualcomm-ui/dom/query"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {ensure} from "@qualcomm-ui/utils/guard"
import type {
  EventKeyMap,
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {domEls, domIds} from "./internal"
import {
  formatDate,
  getCalendarDates,
  getDateId,
  getDayOfMonth,
  getMonthName,
  getYear,
  isInMonth,
  isSameDay,
  isToday,
} from "./internal/calendar-utils"
import type {
  DatePickerApi,
  DatePickerCalendarBindings,
  DatePickerCellBindings,
  DatePickerCellProps,
  DatePickerCellState,
  DatePickerClearTriggerBindings,
  DatePickerContentBindings,
  DatePickerControlsBindings,
  DatePickerErrorIndicatorBindings,
  DatePickerErrorTextBindings,
  DatePickerHintBindings,
  DatePickerInputBindings,
  DatePickerLabelBindings,
  DatePickerNextTriggerBindings,
  DatePickerPositionerBindings,
  DatePickerPrevTriggerBindings,
  DatePickerRootBindings,
  DatePickerSchema,
  DatePickerTodayTriggerBindings,
  DatePickerTriggerBindings,
  DatePickerViewTriggerBindings,
} from "./date-picker.types"

export function createDatePickerApi(
  machine: Machine<DatePickerSchema>,
  normalize: PropNormalizer,
): DatePickerApi {
  const {computed, context, prop, scope, send, state} = machine

  const disabled = prop("disabled")
  const invalid = prop("invalid")
  const readOnly = prop("readOnly")

  const open = state.hasTag("open")
  const focused = state.hasTag("focused")

  const value = context.get("value")
  const valueAsString = context.get("valueAsString")
  const focusedDate = context.get("focusedDate")
  const view = context.get("view")
  const currentPlacement = context.get("currentPlacement")

  const interactive = computed("isInteractive")

  function getCellState(props: DatePickerCellProps): DatePickerCellState {
    const {date} = props
    const min = prop("min")
    const max = prop("max")
    
    const dateId = getDateId(date)
    const disabledByRange =
      (min && date < min) || (max && date > max)

    return {
      date,
      dateAsString: dateId,
      disabled: Boolean(disabled || disabledByRange),
      inRange: !disabledByRange,
      isToday: isToday(date),
      outsideMonth: !isInMonth(date, focusedDate),
      selected: isSameDay(date, value),
    }
  }

  const popperStyles = getPlacementStyles({
    ...prop("positioning"),
    placement: currentPlacement,
  })

  return {
    clearValue() {
      send({type: "VALUE.CLEAR"})
    },
    disabled: Boolean(disabled),
    empty: computed("isEmpty"),
    focus() {
      domEls.input(scope)?.focus({preventScroll: true})
    },
    focused,
    focusedDate,
    formattedValue: valueAsString,
    getCellState,
    open,
    reposition(options: Partial<PositioningOptions> = {}) {
      send({options, type: "POSITIONING.SET"})
    },
    required: prop("required"),
    selectDate(date: Date) {
      send({type: "CELL.CLICK", value: date})
    },
    setOpen(nextOpen) {
      const open = state.hasTag("open")
      if (open === nextOpen) {
        return
      }
      send({type: nextOpen ? "OPEN" : "CLOSE"})
    },
    setValue(value: Date | null) {
      send({type: "VALUE.SET", value})
    },
    setView(view: "day" | "month" | "year") {
      send({type: "VIEW.CHANGE", view})
    },
    value,
    view,

    // group: prop getters
    getCalendarBindings(props): DatePickerCalendarBindings {
      scope.ids.register("calendar", props)
      return normalize.element({
        "data-part": "calendar",
        "data-scope": "date-picker",
        "data-view": view,
        dir: prop("dir"),
        id: domIds.calendar(scope),
        role: "grid",
      })
    },

    getCellBindings(props): DatePickerCellBindings {
      const cellState = getCellState(props)
      const {date, disabled: cellDisabled, selected} = cellState
      const dateId = getDateId(date)

      return normalize.element({
        "aria-disabled": booleanAriaAttr(cellDisabled),
        "aria-selected": booleanAriaAttr(selected),
        "data-date": dateId,
        "data-disabled": booleanDataAttr(cellDisabled),
        "data-outside-month": booleanDataAttr(cellState.outsideMonth),
        "data-part": "cell",
        "data-scope": "date-picker",
        "data-selected": booleanDataAttr(selected),
        "data-today": booleanDataAttr(cellState.isToday),
        dir: prop("dir"),
        id: (domIds.calendarCell as any)(scope, dateId),
        onClick(event) {
          if (!interactive || cellDisabled) {
            return
          }
          send({type: "CELL.CLICK", value: date})
        },
        onPointerMove(event) {
          if (!interactive || cellDisabled) {
            return
          }
          send({type: "CELL.POINTER_MOVE", value: date})
        },
        role: "gridcell",
        tabIndex: isSameDay(date, focusedDate) ? 0 : -1,
      })
    },

    getClearTriggerBindings(props): DatePickerClearTriggerBindings {
      scope.ids.register("clearTrigger", props)
      return normalize.button({
        "aria-label": "Clear value",
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "clear-trigger",
        "data-scope": "date-picker",
        dir: prop("dir"),
        disabled: Boolean(disabled),
        hidden: computed("isEmpty"),
        id: domIds.clearTrigger(scope),
        onClick(event) {
          if (!interactive) {
            return
          }
          send({type: "VALUE.CLEAR"})
        },
        type: "button",
      })
    },

    getContentBindings(props): DatePickerContentBindings {
      scope.ids.register("content", props)
      const keyMap: EventKeyMap = {
        ArrowDown() {
          send({type: "CALENDAR.ARROW_DOWN"})
        },
        ArrowLeft() {
          send({type: "CALENDAR.ARROW_LEFT"})
        },
        ArrowRight() {
          send({type: "CALENDAR.ARROW_RIGHT"})
        },
        ArrowUp() {
          send({type: "CALENDAR.ARROW_UP"})
        },
        End() {
          send({type: "CALENDAR.END"})
        },
        Enter() {
          send({type: "CALENDAR.ENTER"})
        },
        Home() {
          send({type: "CALENDAR.HOME"})
        },
        PageDown() {
          send({type: "CALENDAR.PAGE_DOWN"})
        },
        PageUp() {
          send({type: "CALENDAR.PAGE_UP"})
        },
      }

      return normalize.element({
        "data-focus-visible": booleanDataAttr(isFocusVisible()),
        "data-part": "content",
        "data-placement": currentPlacement,
        "data-scope": "date-picker",
        "data-state": open ? "open" : "closed",
        dir: prop("dir"),
        hidden: !open,
        id: domIds.content(scope),
        onKeyDown(event: any) {
          if (!interactive) {
            return
          }
          const key = getEventKey(event, {dir: prop("dir")})
          const exec = keyMap[key]
          if (exec) {
            event.preventDefault()
            exec(event)
          }
        },
        role: "dialog",
        tabIndex: -1,
      })
    },

    getControlsBindings(props): DatePickerControlsBindings {
      scope.ids.register("controls", props)
      return normalize.element({
        "data-part": "controls",
        "data-scope": "date-picker",
        dir: prop("dir"),
        id: domIds.controls(scope),
      })
    },

    getErrorIndicatorBindings(): DatePickerErrorIndicatorBindings {
      return normalize.element({
        "aria-hidden": true,
        "aria-label": "Error",
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "error-indicator",
        "data-scope": "date-picker",
        dir: prop("dir"),
        hidden: Boolean(!invalid),
      })
    },

    getErrorTextBindings(props): DatePickerErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        "aria-live": "polite",
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "error-text",
        "data-scope": "date-picker",
        dir: prop("dir"),
        hidden: !invalid,
        id: domIds.errorText(scope),
      })
    },

    getHintBindings(props): DatePickerHintBindings {
      scope.ids.register("hint", props)
      return normalize.element({
        "data-disabled": booleanDataAttr(disabled),
        "data-part": "hint",
        "data-scope": "date-picker",
        dir: prop("dir"),
        hidden: Boolean(disabled),
        id: domIds.hint(scope),
      })
    },

    getInputBindings(props): DatePickerInputBindings {
      scope.ids.register("input", props)
      return normalize.input({
        "aria-controls": domIds.content(scope),
        "aria-expanded": booleanAriaAttr(open),
        "aria-invalid": booleanAriaAttr(invalid),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "input",
        "data-scope": "date-picker",
        "data-state": open ? "open" : "closed",
        defaultValue: valueAsString,
        dir: prop("dir"),
        disabled: Boolean(disabled),
        form: prop("form"),
        id: domIds.input(scope),
        name: prop("name"),
        onBlur(event) {
          if (!interactive) {
            return
          }
          send({type: "INPUT.BLUR"})
        },
        onChange(event) {
          if (!interactive || readOnly) {
            return
          }
          const target = getEventTarget<HTMLInputElement>(event)
          if (!target) return
          send({type: "INPUT.CHANGE", value: target.value})
        },
        onFocus(event) {
          if (!interactive) {
            return
          }
          send({type: "INPUT.FOCUS"})
        },
        placeholder: prop("placeholder"),
        readOnly: Boolean(readOnly),
        required: prop("required"),
        type: "text",
      })
    },

    getLabelBindings(props): DatePickerLabelBindings {
      scope.ids.register("label", props)
      return normalize.label({
        "data-disabled": booleanDataAttr(disabled),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "label",
        "data-readonly": booleanDataAttr(readOnly),
        "data-scope": "date-picker",
        dir: prop("dir"),
        htmlFor: domIds.input(scope),
        id: domIds.label(scope),
        onClick(event) {
          if (!interactive) {
            return
          }
          const target = getEventTarget(event)
          if (target === domEls.label(scope)) {
            domEls.input(scope)?.focus({preventScroll: true})
          }
        },
      })
    },

    getNextTriggerBindings(props): DatePickerNextTriggerBindings {
      scope.ids.register("nextTrigger", props)
      const label = view === "day"
        ? "Next month"
        : view === "month"
        ? "Next year"
        : "Next decade"

      return normalize.button({
        "aria-label": label,
        "data-disabled": booleanDataAttr(disabled),
        "data-part": "next-trigger",
        "data-scope": "date-picker",
        dir: prop("dir"),
        disabled: Boolean(disabled),
        id: domIds.nextTrigger(scope),
        onClick(event) {
          if (!interactive) {
            return
          }
          if (view === "day") {
            send({type: "NEXT_MONTH.CLICK"})
          } else if (view === "year") {
            send({type: "NEXT_YEAR.CLICK"})
          }
        },
        type: "button",
      })
    },

    getPositionerBindings(props): DatePickerPositionerBindings {
      scope.ids.register("positioner", props)
      return normalize.element({
        "data-part": "positioner",
        "data-scope": "date-picker",
        dir: prop("dir"),
        id: domIds.positioner(scope),
        style: popperStyles.floating,
      })
    },

    getPrevTriggerBindings(props): DatePickerPrevTriggerBindings {
      scope.ids.register("prevTrigger", props)
      const label = view === "day"
        ? "Previous month"
        : view === "month"
        ? "Previous year"
        : "Previous decade"

      return normalize.button({
        "aria-label": label,
        "data-disabled": booleanDataAttr(disabled),
        "data-part": "prev-trigger",
        "data-scope": "date-picker",
        dir: prop("dir"),
        disabled: Boolean(disabled),
        id: domIds.prevTrigger(scope),
        onClick(event) {
          if (!interactive) {
            return
          }
          if (view === "day") {
            send({type: "PREV_MONTH.CLICK"})
          } else if (view === "year") {
            send({type: "PREV_YEAR.CLICK"})
          }
        },
        type: "button",
      })
    },

    getRootBindings(props): DatePickerRootBindings {
      scope.ids.register("root", props)
      return normalize.element({
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "root",
        "data-readonly": booleanDataAttr(readOnly),
        "data-scope": "date-picker",
        dir: prop("dir"),
        id: domIds.root(scope),
      })
    },

    getTodayTriggerBindings(props): DatePickerTodayTriggerBindings {
      scope.ids.register("todayTrigger", props)
      return normalize.button({
        "aria-label": "Go to today",
        "data-part": "today-trigger",
        "data-scope": "date-picker",
        dir: prop("dir"),
        id: domIds.todayTrigger(scope),
        onClick(event) {
          if (!interactive) {
            return
          }
          send({type: "TODAY.CLICK"})
        },
        type: "button",
      })
    },

    getTriggerBindings(props): DatePickerTriggerBindings {
      scope.ids.register("trigger", props)
      return normalize.button({
        "aria-controls": domIds.content(scope),
        "aria-expanded": booleanAriaAttr(open),
        "aria-label": "Toggle calendar",
        "data-disabled": booleanDataAttr(disabled),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "trigger",
        "data-scope": "date-picker",
        "data-state": open ? "open" : "closed",
        dir: prop("dir"),
        disabled: Boolean(disabled),
        id: domIds.trigger(scope),
        onClick(event) {
          if (!interactive) {
            return
          }
          send({type: "TRIGGER.CLICK"})
        },
        tabIndex: -1,
        type: "button",
      })
    },

    getViewTriggerBindings(props): DatePickerViewTriggerBindings {
      scope.ids.register("viewTrigger", props)
      return normalize.button({
        "aria-label": "Change view",
        "data-part": "view-trigger",
        "data-scope": "date-picker",
        dir: prop("dir"),
        id: domIds.viewTrigger(scope),
        onClick(event) {
          if (!interactive) {
            return
          }
          send({type: "VIEW_TRIGGER.CLICK"})
        },
        type: "button",
      })
    },
  }
}
