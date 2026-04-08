// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {trackDismissableElement} from "@qualcomm-ui/dom/dismissable"
import {getPlacement, type Placement} from "@qualcomm-ui/dom/floating-ui"
import {trackFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {raf} from "@qualcomm-ui/dom/query"
import {isDefined} from "@qualcomm-ui/utils/guard"
import {
  createGuards,
  createMachine,
  type MachineConfig,
} from "@qualcomm-ui/utils/machine"

import type {DatePickerSchema} from "./date-picker.types"
import {domEls} from "./internal"
import {
  addDays,
  addMonths,
  addYears,
  formatDate,
  getToday,
  isInRange,
} from "./internal/calendar-utils"

const {and} = createGuards<DatePickerSchema>()

export const datePickerMachine: MachineConfig<DatePickerSchema> =
  createMachine<DatePickerSchema>({
    actions: {
      clearValue({context}) {
        context.set("value", null)
        context.set("valueAsString", "")
      },

      focusDate({context, event}) {
        if (event.type !== "CELL.POINTER_MOVE") {
          return
        }
        context.set("focusedDate", event.value)
      },

      focusInput({scope}) {
        raf(() => {
          const inputEl = domEls.input(scope)
          inputEl?.focus({preventScroll: true})
        })
      },

      focusNextDay({context}) {
        const focusedDate = context.get("focusedDate")
        context.set("focusedDate", addDays(focusedDate, 1))
      },

      focusNextMonth({context}) {
        const focusedDate = context.get("focusedDate")
        context.set("focusedDate", addMonths(focusedDate, 1))
      },

      focusNextWeek({context}) {
        const focusedDate = context.get("focusedDate")
        context.set("focusedDate", addDays(focusedDate, 7))
      },

      focusNextYear({context}) {
        const focusedDate = context.get("focusedDate")
        context.set("focusedDate", addYears(focusedDate, 1))
      },

      focusPrevDay({context}) {
        const focusedDate = context.get("focusedDate")
        context.set("focusedDate", addDays(focusedDate, -1))
      },

      focusPrevMonth({context}) {
        const focusedDate = context.get("focusedDate")
        context.set("focusedDate", addMonths(focusedDate, -1))
      },

      focusPrevWeek({context}) {
        const focusedDate = context.get("focusedDate")
        context.set("focusedDate", addDays(focusedDate, -7))
      },

      focusPrevYear({context}) {
        const focusedDate = context.get("focusedDate")
        context.set("focusedDate", addYears(focusedDate, -1))
      },

      focusTrigger({scope}) {
        raf(() => {
          const triggerEl = domEls.trigger(scope)
          triggerEl?.focus({preventScroll: true})
        })
      },

      goToNextMonth({context}) {
        const focusedDate = context.get("focusedDate")
        context.set("focusedDate", addMonths(focusedDate, 1))
      },

      goToNextYear({context}) {
        const focusedDate = context.get("focusedDate")
        context.set("focusedDate", addYears(focusedDate, 1))
      },

      goToPrevMonth({context}) {
        const focusedDate = context.get("focusedDate")
        context.set("focusedDate", addMonths(focusedDate, -1))
      },

      goToPrevYear({context}) {
        const focusedDate = context.get("focusedDate")
        context.set("focusedDate", addYears(focusedDate, -1))
      },

      goToToday({context}) {
        context.set("focusedDate", getToday())
      },

      invokeOnClose({prop}) {
        prop("onOpenChange")?.({open: false})
      },

      invokeOnOpen({prop}) {
        prop("onOpenChange")?.({open: true})
      },

      reposition({context, event, prop, scope}) {
        if (event.type !== "POSITIONING.SET") {
          return
        }
        const anchorEl = () => domEls.input(scope)
        const positionerEl = () => domEls.positioner(scope)
        getPlacement(anchorEl, positionerEl, {
          ...prop("positioning"),
          ...event.options,
          defer: true,
          listeners: false,
          onComplete(data) {
            context.set("currentPlacement", data.placement)
          },
        })
      },

      selectDate({context, event, prop}) {
        if (event.type !== "CELL.CLICK") {
          return
        }
        const date = event.value
        const format = prop("format")
        const locale = prop("locale")

        context.set("value", date)
        context.set("valueAsString", formatDate(date, format, locale))

        prop("onValueChange")?.({
          value: date,
          valueAsString: formatDate(date, format, locale),
        })
      },

      selectFocusedDate({context, prop}) {
        const date = context.get("focusedDate")
        const format = prop("format")
        const locale = prop("locale")

        context.set("value", date)
        context.set("valueAsString", formatDate(date, format, locale))

        prop("onValueChange")?.({
          value: date,
          valueAsString: formatDate(date, format, locale),
        })
      },

      selectToday({context, prop}) {
        const date = getToday()
        const format = prop("format")
        const locale = prop("locale")

        context.set("value", date)
        context.set("valueAsString", formatDate(date, format, locale))
        context.set("focusedDate", date)

        prop("onValueChange")?.({
          value: date,
          valueAsString: formatDate(date, format, locale),
        })
      },

      setFocusedDate({context, event}) {
        if (event.type !== "VALUE.SET" || !event.value) {
          return
        }
        context.set("focusedDate", event.value)
      },

      setInitialFocus({scope}) {
        raf(() => {
          const contentEl = domEls.content(scope)
          contentEl?.focus({preventScroll: true})
        })
      },

      setValue({context, event, prop}) {
        if (event.type !== "VALUE.SET") {
          return
        }
        const value = event.value
        const format = prop("format")
        const locale = prop("locale")

        context.set("value", value)
        context.set("valueAsString", value ? formatDate(value, format, locale) : "")

        if (value) {
          context.set("focusedDate", value)
        }
      },

      setView({context, event, prop}) {
        if (event.type !== "VIEW.CHANGE") {
          return
        }
        context.set("view", event.view)
        prop("onViewChange")?.({view: event.view})
      },

      setViewToDay({context}) {
        context.set("view", "day")
      },

      setViewToMonth({context}) {
        context.set("view", "month")
      },

      setViewToYear({context}) {
        context.set("view", "year")
      },

      toggleVisibility({event, prop, send}) {
        send({
          type: prop("open") ? "CONTROLLED.OPEN" : "CONTROLLED.CLOSE",
        })
      },
    },

    computed: {
      isDisabled: ({prop}) => !!prop("disabled"),
      isEmpty: ({context}) => context.get("value") === null,
      isInteractive: ({prop}) => !(prop("disabled") || prop("readOnly")),
    },

    context({bindable, prop}) {
      return {
        currentPlacement: bindable<Placement | undefined>(() => ({
          defaultValue: undefined,
        })),
        focusedDate: bindable<Date>(() => {
          const defaultFocusedDate =
            prop("defaultFocusedDate") ||
            prop("value") ||
            prop("defaultValue") ||
            getToday()
          return {
            defaultValue: defaultFocusedDate,
            onChange(focusedDate) {
              prop("onFocusChange")?.({
                focusedDate,
                view: prop("view"),
              })
            },
            value: prop("focusedDate"),
          }
        }),
        value: bindable<Date | null>(() => ({
          defaultValue: prop("defaultValue") || null,
          onChange(value) {
            const format = prop("format")
            const locale = prop("locale")
            prop("onValueChange")?.({
              value,
              valueAsString: value ? formatDate(value, format, locale) : "",
            })
          },
          value: prop("value"),
        })),
        valueAsString: bindable<string>(() => {
          const value = prop("value") || prop("defaultValue")
          const format = prop("format")
          const locale = prop("locale")
          return {
            defaultValue: value ? formatDate(value, format, locale) : "",
          }
        }),
        view: bindable<"day" | "month" | "year">(() => ({
          defaultValue: prop("view"),
          onChange(view) {
            prop("onViewChange")?.({view})
          },
        })),
      }
    },

    effects: {
      trackDismissableElement({prop, scope, send}) {
        const contentEl = () => domEls.content(scope)
        return trackDismissableElement(contentEl, {
          defer: true,
          exclude: () => [domEls.input(scope), domEls.trigger(scope)],
          onDismiss() {
            send({type: "CLOSE"})
          },
          onEscapeKeyDown(event) {
            event.preventDefault()
            send({type: "CALENDAR.ESCAPE"})
          },
          onFocusOutside: prop("onFocusOutside"),
          onInteractOutside: prop("onInteractOutside"),
          onPointerDownOutside: prop("onPointerDownOutside"),
        })
      },

      trackFocusVisible({scope}) {
        return trackFocusVisible({root: scope.getRootNode?.()})
      },

      trackPlacement({context, prop, scope}) {
        context.set("currentPlacement", prop("positioning").placement)
        const anchorEl = () => domEls.input(scope)
        const positionerEl = () => domEls.positioner(scope)
        return getPlacement(anchorEl, positionerEl, {
          ...prop("positioning"),
          defer: true,
          onComplete(data) {
            context.set("currentPlacement", data.placement)
          },
        })
      },
    },

    guards: {
      closeOnSelect: ({prop}) => !!prop("closeOnSelect"),
      isDateDisabled: ({context, prop}) => {
        const focusedDate = context.get("focusedDate")
        return !isInRange(focusedDate, prop("min"), prop("max"))
      },
      isDateInRange: ({event, prop}) => {
        if (event.type !== "CELL.CLICK") return true
        return isInRange(event.value, prop("min"), prop("max"))
      },
      isOpenControlled: ({prop}) => isDefined(prop("open")),
    },

    ids: ({bindableId, ids}) => {
      return {
        calendar: bindableId(ids?.calendar),
        calendarCell: bindableId<(date: string) => string>(),
        calendarRow: bindableId<(rowIndex: number) => string>(),
        clearTrigger: bindableId(ids?.clearTrigger),
        content: bindableId(ids?.content),
        controls: bindableId(ids?.controls),
        errorText: bindableId(ids?.errorText),
        hint: bindableId(ids?.hint),
        input: bindableId(ids?.input),
        label: bindableId(ids?.label),
        nextTrigger: bindableId(ids?.nextTrigger),
        positioner: bindableId(ids?.positioner),
        prevTrigger: bindableId(ids?.prevTrigger),
        root: bindableId(ids?.root),
        todayTrigger: bindableId(ids?.todayTrigger),
        trigger: bindableId(ids?.trigger),
        viewTrigger: bindableId(ids?.viewTrigger),
      }
    },

    initialState({prop}) {
      const open = prop("open") || prop("defaultOpen")
      return open ? "open" : "idle"
    },

    on: {
      "POSITIONING.SET": {
        actions: ["reposition"],
      },
      "VALUE.CLEAR": {
        actions: ["clearValue"],
      },
      "VALUE.SET": {
        actions: ["setValue", "setFocusedDate"],
      },
      "VIEW.CHANGE": {
        actions: ["setView"],
      },
    },

    props({props}) {
      return {
        closeOnSelect: true,
        format: "MM/DD/YYYY",
        locale: "en-US",
        loopFocus: false,
        view: "day",
        ...props,
        positioning: {
          gutter: 2,
          placement: "bottom-start",
          sameWidth: true,
          ...props.positioning,
        },
      }
    },

    refs: () => {
      return {}
    },

    states: {
      idle: {
        on: {
          "CONTROLLED.OPEN": {
            actions: ["setInitialFocus"],
            target: "open",
          },
          "INPUT.FOCUS": {
            target: "focused",
          },
          OPEN: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["setInitialFocus", "invokeOnOpen"],
              target: "open",
            },
          ],
          "TRIGGER.CLICK": [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["setInitialFocus", "invokeOnOpen"],
              target: "open",
            },
          ],
        },
        tags: ["closed"],
      },

      focused: {
        on: {
          "CONTROLLED.OPEN": {
            actions: ["setInitialFocus"],
            target: "open",
          },
          "INPUT.BLUR": {
            target: "idle",
          },
          OPEN: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["setInitialFocus", "invokeOnOpen"],
              target: "open",
            },
          ],
          "TRIGGER.CLICK": [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["setInitialFocus", "invokeOnOpen"],
              target: "open",
            },
          ],
        },
        tags: ["closed", "focused"],
      },

      open: {
        effects: ["trackDismissableElement", "trackPlacement", "trackFocusVisible"],
        on: {
          "CALENDAR.ARROW_DOWN": {
            actions: ["focusNextWeek"],
          },
          "CALENDAR.ARROW_LEFT": {
            actions: ["focusPrevDay"],
          },
          "CALENDAR.ARROW_RIGHT": {
            actions: ["focusNextDay"],
          },
          "CALENDAR.ARROW_UP": {
            actions: ["focusPrevWeek"],
          },
          "CALENDAR.END": {
            actions: ["focusNextMonth"],
          },
          "CALENDAR.ENTER": [
            {
              actions: ["selectFocusedDate", "invokeOnClose", "focusInput"],
              guard: "closeOnSelect",
              target: "focused",
            },
            {
              actions: ["selectFocusedDate"],
            },
          ],
          "CALENDAR.ESCAPE": [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose", "focusInput"],
              target: "focused",
            },
          ],
          "CALENDAR.HOME": {
            actions: ["focusPrevMonth"],
          },
          "CALENDAR.PAGE_DOWN": {
            actions: ["focusNextMonth"],
          },
          "CALENDAR.PAGE_UP": {
            actions: ["focusPrevMonth"],
          },
          "CELL.CLICK": [
            {
              actions: ["selectDate", "invokeOnClose", "focusInput"],
              guard: and("isDateInRange", "closeOnSelect"),
              target: "focused",
            },
            {
              actions: ["selectDate"],
              guard: "isDateInRange",
            },
          ],
          "CELL.POINTER_MOVE": {
            actions: ["focusDate"],
          },
          CLOSE: [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose", "focusInput"],
              target: "focused",
            },
          ],
          "CONTROLLED.CLOSE": {
            actions: ["focusInput"],
            target: "focused",
          },
          "NEXT_MONTH.CLICK": {
            actions: ["goToNextMonth"],
          },
          "NEXT_YEAR.CLICK": {
            actions: ["goToNextYear"],
          },
          "PREV_MONTH.CLICK": {
            actions: ["goToPrevMonth"],
          },
          "PREV_YEAR.CLICK": {
            actions: ["goToPrevYear"],
          },
          "TODAY.CLICK": [
            {
              actions: ["selectToday", "invokeOnClose", "focusInput"],
              guard: "closeOnSelect",
              target: "focused",
            },
            {
              actions: ["selectToday"],
            },
          ],
          "TRIGGER.CLICK": [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose", "focusInput"],
              target: "focused",
            },
          ],
          "VIEW_TRIGGER.CLICK": {
            actions: ["setViewToMonth"],
          },
        },
        tags: ["open"],
      },
    },

    watch({action, context, prop, track}) {
      track([() => prop("open")], () => {
        action(["toggleVisibility"])
      })
      track([() => context.get("view")], () => {
        const view = context.get("view")
        prop("onViewChange")?.({view})
      })
    },
  })
