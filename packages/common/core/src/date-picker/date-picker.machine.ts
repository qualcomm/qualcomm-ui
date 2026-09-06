// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type Calendar,
  type CalendarIdentifier,
  DateFormatter,
  type DateValue,
  toCalendar,
  toCalendarDateTime,
  toZoned,
} from "@internationalized/date"

import {trackDismissableElement} from "@qualcomm-ui/dom/dismissable"
import {getPlacement, type Placement} from "@qualcomm-ui/dom/floating-ui"
import {trapFocus} from "@qualcomm-ui/dom/focus-trap"
import {createLiveRegion} from "@qualcomm-ui/dom/live-region"
import {
  disableTextSelection,
  raf,
  restoreTextSelection,
  setElementValue,
  trackFormControl,
} from "@qualcomm-ui/dom/query"
import {
  type AdjustDateReturn,
  alignDate,
  constrainValue,
  formatSelectedDate,
  getAdjustedDateFn,
  getDecadeRange,
  getEndDate,
  getNextPage,
  getNextSection,
  getPreviousPage,
  getPreviousSection,
  getTodayDate,
  isDateEqual,
  isDateOutsideRange,
  isNextRangeInvalid,
  isPreviousRangeInvalid,
  parseDateString,
} from "@qualcomm-ui/utils/date-utils"
import {
  createGuards,
  createMachine,
  type MachineConfig,
  type Params,
  type PropFn,
} from "@qualcomm-ui/utils/machine"

import type {
  DatePickerActionEvent,
  DatePickerSchema,
  DatePickerDateView,
  DatePickerScope,
  DatePickerSelectionMode,
} from "./date-picker.types.js"
import {
  adjustStartAndEndDate,
  clampView,
  eachView,
  getNextView,
  getPreviousView,
  getVisibleRangeText,
  isAboveMinView,
  isBelowMinView,
  isValidDate,
  normalizeValueForMode,
  sortDates,
} from "./date-picker.utils.js"
import {domEls, getFocusedCell, getInputEls} from "./internal/index.js"

const {and, not, or} = createGuards<DatePickerSchema>()

function isDateArrayEqual(
  a: (DateValue | null)[],
  b: (DateValue | null)[] | undefined,
) {
  if (a?.length !== b?.length) {
    return false
  }
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    if (!isDateEqual(a[i], b[i])) {
      return false
    }
  }
  return true
}

function canPreviewRangeSelection(
  value: (DateValue | null)[],
  activeIndex: number,
): boolean {
  const anchorIndex = activeIndex === 0 ? 1 : 0
  return value[anchorIndex] != null && value[activeIndex] == null
}

function getNextActiveIndex(
  value: (DateValue | null)[],
  mode: DatePickerSelectionMode,
): number {
  return mode === "range" && value[0] != null && value[1] == null ? 1 : 0
}

function getValueAsString(
  value: (DateValue | null)[],
  prop: PropFn<DatePickerSchema>,
) {
  return value.map((date) => {
    if (date == null) {
      return ""
    }
    return prop("format")!(date, {
      locale: prop("locale")!,
      timeZone: prop("timeZone")!,
    })
  })
}

function getDefaultSubmitButton(form: HTMLFormElement) {
  for (const el of form.elements) {
    if ((el as HTMLButtonElement).type === "submit") {
      return el as HTMLButtonElement
    }
  }
  return undefined
}

function writeInputElements(scope: DatePickerScope, values: string[]) {
  for (const [index, inputEl] of getInputEls(scope).entries()) {
    setElementValue(inputEl, values[index] || "")
  }
}

export const datePickerMachine: MachineConfig<DatePickerSchema> =
  createMachine<DatePickerSchema>({
    actions: {
      adjustValueToSelectionMode({context, flush, prop}) {
        const mode = prop("selectionMode") || "single"
        const values = context.get("value")
        const next = normalizeValueForMode(values, mode)
        if (!isDateArrayEqual(next, values)) {
          context.set("value", next)
        }
        const nextActiveIndex = getNextActiveIndex(context.get("value"), mode)
        if (context.get("activeIndex") !== nextActiveIndex) {
          flush(() => context.set("activeIndex", nextActiveIndex))
        }
      },
      announceValueText({context, prop, refs}) {
        const value = context.get("value")
        const locale = prop("locale")!
        const timeZone = prop("timeZone")!

        let announceText: string
        if (prop("selectionMode") === "range") {
          const [startDate, endDate] = value
          if (startDate && endDate) {
            announceText = formatSelectedDate(
              startDate,
              endDate,
              locale,
              timeZone,
            )
          } else if (startDate) {
            announceText = formatSelectedDate(startDate, null, locale, timeZone)
          } else if (endDate) {
            announceText = formatSelectedDate(endDate, null, locale, timeZone)
          } else {
            announceText = ""
          }
        } else {
          announceText = value
            .map((date) => formatSelectedDate(date, null, locale, timeZone))
            .filter(Boolean)
            .join(",")
        }

        refs.get("announcer")?.announce(announceText, 3000)
      },
      announceVisibleRange({computed, refs}) {
        const {formatted} = computed("visibleRangeText")
        refs.get("announcer")?.announce(formatted)
      },
      cancelSyncInputElement({refs}) {
        refs.get("syncInputElementCleanup")?.()
        refs.set("syncInputElementCleanup", undefined)
      },
      clearDateValue({context, event, prop, refs}) {
        const index = (event as DatePickerActionEvent).index
        let next: (DateValue | null)[] = []
        if (index != null && prop("selectionMode") === "range") {
          const [start, end] = context.get("value")
          if (index === 1) {
            next = start != null ? [start] : []
          } else {
            next = end != null ? [null, end] : []
          }
        }
        context.set("value", next)
        if (event.type === "VALUE.CLEAR") {
          refs.set("valueSnapshot", Array.from(next))
        }
      },
      clearFocusedDate(params) {
        const {context, event, prop} = params
        const index = (event as DatePickerActionEvent).index
        if (index != null && prop("selectionMode") === "range") {
          const value = context.get("value")
          const retained = index === 1 ? value[0] : value[1]
          if (retained != null) {
            setFocusedValue(params, retained)
            return
          }
        }
        const calendar = context.get("focusedValue").calendar
        setFocusedValue(params, getTodayDate(prop("timeZone"), calendar))
      },
      clearHoveredDate({context}) {
        context.set("hoveredValue", null)
      },
      clearRestoreFocus({context}) {
        context.set("restoreFocus", false)
      },
      closePresets({context}) {
        context.set("presetsOpen", false)
      },
      disableTextSelection({scope}) {
        disableTextSelection({
          doc: scope.getDoc(),
          target: domEls.content(scope),
        })
      },
      enableTextSelection({scope}) {
        restoreTextSelection({
          doc: scope.getDoc(),
          target: domEls.content(scope),
        })
      },
      focusActiveCell({context, event, scope}) {
        const evt = event as DatePickerActionEvent
        if (
          ((evt.previousEvent ?? evt) as DatePickerActionEvent).src ===
          "input.click"
        ) {
          return
        }
        raf(() => {
          const view = context.get("view")
          getFocusedCell(scope, view)?.focus({preventScroll: true})
        })
      },
      focusActiveCellIfNeeded({context, event, scope}) {
        if (!(event as DatePickerActionEvent).focus) {
          return
        }
        raf(() => {
          const view = context.get("view")
          getFocusedCell(scope, view)?.focus({preventScroll: true})
        })
      },
      focusFirstInputElement({event, scope}) {
        if ((event as DatePickerActionEvent).focus === false) {
          return
        }
        raf(() => {
          const [inputEl] = getInputEls(scope)
          // if no input elements exist (trigger-only mode),
          // focus the trigger instead
          const elementToFocus = inputEl ?? domEls.trigger(scope)
          elementToFocus?.focus({preventScroll: true})
        })
      },
      focusFirstMonth(params) {
        const {context} = params
        const focused = context.get("focusedValue")
        const minMonth = focused.calendar.getMinimumMonthInYear?.(focused) ?? 1
        setFocusedValue(params, focused.set({month: minMonth}))
      },
      focusFirstSelectedDate(params) {
        const {context} = params
        const firstSelected = context.get("value").find((date) => date != null)
        setFocusedValue(
          params,
          firstSelected ?? context.initial("focusedValue"),
        )
      },
      focusFirstYear(params) {
        const {context} = params
        const range = getDecadeRange(context.get("focusedValue").year)
        const nextValue = context.get("focusedValue").set({year: range[0]})
        setFocusedValue(params, nextValue)
      },
      focusInputElement({scope}) {
        raf(() => {
          const inputEls = getInputEls(scope)

          // If no input elements exist (trigger-only mode),
          // focus the trigger instead
          if (inputEls.length === 0) {
            domEls.trigger(scope)?.focus({preventScroll: true})
            return
          }

          const lastIndexWithValue = inputEls.findLastIndex(
            (inputEl) => inputEl.value !== "",
          )
          const indexToFocus = Math.max(lastIndexWithValue, 0)

          const inputEl = inputEls[indexToFocus]
          inputEl?.focus({preventScroll: true})
          // move cursor to the end
          inputEl?.setSelectionRange(inputEl.value.length, inputEl.value.length)
        })
      },
      focusLastMonth(params) {
        const {context} = params
        const focused = context.get("focusedValue")
        const maxMonth = focused.calendar.getMonthsInYear(focused)
        setFocusedValue(params, focused.set({month: maxMonth}))
      },
      focusLastYear(params) {
        const {context} = params
        const range = getDecadeRange(context.get("focusedValue").year)
        const nextValue = context
          .get("focusedValue")
          .set({year: range[range.length - 1]})
        setFocusedValue(params, nextValue)
      },
      focusNextDay(params) {
        const {context} = params
        const nextValue = context.get("focusedValue").add({days: 1})
        setFocusedValue(params, nextValue)
      },
      focusNextDecade(params) {
        const {context} = params
        const nextValue = context.get("focusedValue").add({years: 10})
        setFocusedValue(params, nextValue)
      },
      focusNextMonth(params) {
        const {context} = params
        setFocusedValue(params, context.get("focusedValue").add({months: 1}))
      },
      focusNextMonthColumn(params) {
        const {context, event} = params
        const nextValue = context
          .get("focusedValue")
          .add({months: (event as DatePickerActionEvent).columns})
        setFocusedValue(params, nextValue)
      },
      focusNextPage(params) {
        const {computed, context, prop} = params
        const nextPage = getNextPage(
          context.get("focusedValue"),
          context.get("startValue"),
          computed("visibleDuration"),
          prop("locale")!,
          prop("min"),
          prop("max"),
        )

        setAdjustedValue(params, nextPage)
      },
      focusNextSection(params) {
        const {computed, context, event, prop} = params
        const nextSection = getNextSection(
          context.get("focusedValue"),
          context.get("startValue"),
          (event as DatePickerActionEvent).larger!,
          computed("visibleDuration"),
          prop("locale")!,
          prop("min"),
          prop("max"),
        )

        if (!nextSection) {
          return
        }
        setAdjustedValue(params, nextSection)
      },
      focusNextWeek(params) {
        const {context} = params
        const nextValue = context.get("focusedValue").add({weeks: 1})
        setFocusedValue(params, nextValue)
      },
      focusNextYear(params) {
        const {context} = params
        const nextValue = context.get("focusedValue").add({years: 1})
        setFocusedValue(params, nextValue)
      },
      focusNextYearColumn(params) {
        const {context, event} = params
        const nextValue = context
          .get("focusedValue")
          .add({years: (event as DatePickerActionEvent).columns})
        setFocusedValue(params, nextValue)
      },
      focusParsedDate(params) {
        const {
          event,
          prop,
        }: {event: DatePickerActionEvent; prop: PropFn<DatePickerSchema>} =
          params

        if (event.index == null) {
          return
        }
        const parse = prop("parse")!

        const date = parse(event.value as string, {
          locale: prop("locale")!,
          timeZone: prop("timeZone")!,
        })
        if (!date || !isValidDate(date)) {
          return
        }

        setFocusedValue(params, date)
      },
      focusPreviousDay(params) {
        const {context} = params
        const nextValue = context.get("focusedValue").subtract({days: 1})
        setFocusedValue(params, nextValue)
      },
      focusPreviousDecade(params) {
        const {context} = params
        const nextValue = context.get("focusedValue").subtract({years: 10})
        setFocusedValue(params, nextValue)
      },
      focusPreviousMonth(params) {
        const {context} = params
        setFocusedValue(
          params,
          context.get("focusedValue").subtract({months: 1}),
        )
      },
      focusPreviousMonthColumn(params) {
        const {context, event} = params
        const nextValue = context
          .get("focusedValue")
          .subtract({months: (event as DatePickerActionEvent).columns})
        setFocusedValue(params, nextValue)
      },
      focusPreviousPage(params) {
        const {computed, context, prop} = params
        const previousPage = getPreviousPage(
          context.get("focusedValue"),
          context.get("startValue"),
          computed("visibleDuration"),
          prop("locale")!,
          prop("min"),
          prop("max"),
        )
        setAdjustedValue(params, previousPage)
      },
      focusPreviousSection(params) {
        const {computed, context, event, prop} = params
        const previousSection = getPreviousSection(
          context.get("focusedValue"),
          context.get("startValue"),
          (event as DatePickerActionEvent).larger!,
          computed("visibleDuration"),
          prop("locale")!,
          prop("min"),
          prop("max"),
        )

        if (!previousSection) {
          return
        }
        setAdjustedValue(params, previousSection)
      },
      focusPreviousWeek(params) {
        const {context} = params
        const nextValue = context.get("focusedValue").subtract({weeks: 1})
        setFocusedValue(params, nextValue)
      },
      focusPreviousYear(params) {
        const {context} = params
        const nextValue = context.get("focusedValue").subtract({years: 1})
        setFocusedValue(params, nextValue)
      },
      focusPreviousYearColumn(params) {
        const {context, event} = params
        const nextValue = context
          .get("focusedValue")
          .subtract({years: (event as DatePickerActionEvent).columns})
        setFocusedValue(params, nextValue)
      },
      focusResolvedDate(params) {
        const event = params.event as DatePickerActionEvent

        if (event.index == null) {
          return
        }
        const parsed = event.resolution?.parsed
        if (!parsed) {
          return
        }

        setFocusedValue(params, parsed)
      },
      focusSectionEnd(params) {
        const {computed} = params
        setFocusedValue(params, computed("endValue").copy())
      },
      focusSectionStart(params) {
        const {context} = params
        setFocusedValue(params, context.get("startValue").copy())
      },
      focusTriggerElement({scope}) {
        raf(() => {
          domEls.trigger(scope)?.focus({preventScroll: true})
        })
      },
      invokeOnClose({context, prop}) {
        if (prop("inline")) {
          return
        }
        prop("onOpenChange")?.({open: false, value: context.get("value")})
      },
      invokeOnOpen({context, prop}) {
        if (prop("inline")) {
          return
        }
        prop("onOpenChange")?.({open: true, value: context.get("value")})
      },
      invokeOnVisibleRangeChange({computed, context, prop}) {
        prop("onVisibleRangeChange")?.({
          view: context.get("view"),
          visibleRange: computed("visibleRange"),
        })
      },
      resetSelection(params) {
        const {context, event} = params
        const existingValue = context.get("value")[0]
        const newValue = normalizeValue(
          params,
          ((event as DatePickerActionEvent).value as DateValue) ??
            context.get("focusedValue"),
        )
        context.set("value", [preserveTime(existingValue, newValue)])
      },
      resetView({context}) {
        context.set("view", context.initial("view")!)
      },
      restoreSnapshot({context, refs}) {
        const snapshot = refs.get("valueSnapshot")
        context.set("value", snapshot ? Array.from(snapshot) : [])
      },
      resumeRangeSelection({context, prop}) {
        if (prop("selectionMode") !== "range") {
          return
        }
        const value = context.get("value")
        const startSet = value[0] != null
        const endSet = value[1] != null
        if (startSet && !endSet) {
          context.set("activeIndex", 1)
        } else if (!startSet && endSet) {
          context.set("activeIndex", 0)
        }
      },
      selectFocusedDate({computed, context, prop}) {
        const stored = context.get("value")
        const values =
          prop("selectionMode") === "range"
            ? [stored[0] ?? null, stored[1] ?? null]
            : Array.from(stored)
        const activeIndex = context.get("activeIndex")
        const existingValue = values[activeIndex]
        const newValue = context.get("focusedValue").copy()
        values[activeIndex] = preserveTime(existingValue, newValue)
        context.set("value", adjustStartAndEndDate(values))

        // always sync the input value, even if the selecteddate is not changed
        // e.g. selected value is 02/28/2024, and the input value changed to 02/28
        const valueAsString = computed("valueAsString")
        context.set("inputValue", {
          index: activeIndex,
          value: valueAsString[activeIndex],
        })
      },
      selectResolvedDate({context, event, prop, refs}) {
        const evt = event as DatePickerActionEvent
        const resolution = evt.resolution
        refs.set("pendingFormValueAsString", undefined)
        if (evt.index == null || resolution == null) {
          return
        }

        // restore the last committed value rather than coercing an unparsable
        // or unavailable date
        if (resolution.kind !== "accepted") {
          if (resolution.kind === "unavailable" || evt.value) {
            const committed = getValueAsString(context.get("value"), prop)
            context.set("inputValue", {
              index: evt.index,
              value: committed[evt.index] ?? "",
            })
          }
          return
        }

        const date = resolution.committed
        const stored = context.get("value")
        const values =
          prop("selectionMode") === "range"
            ? [stored[0] ?? null, stored[1] ?? null]
            : Array.from(stored)
        values[evt.index] = preserveTime(values[evt.index], date)
        const adjustedValues = adjustStartAndEndDate(values)

        context.set("value", adjustedValues)
        // always sync the input value, even if the selecteddate is not changed
        // e.g. selected value is 02/28/2024, and the input value changed to 02/28
        const valueAsString = getValueAsString(adjustedValues, prop)
        refs.set("pendingFormValueAsString", valueAsString)
        context.set("inputValue", {
          index: evt.index,
          value: valueAsString[evt.index],
        })

        if (prop("selectionMode") === "range") {
          const startSet = adjustedValues[0] != null
          const endSet = adjustedValues[1] != null
          if (startSet && !endSet) {
            context.set("activeIndex", 1)
          } else if (!startSet && endSet) {
            context.set("activeIndex", 0)
          }
        }
      },
      setActiveIndex({context, event}) {
        context.set("activeIndex", (event as DatePickerActionEvent).index!)
      },
      setActiveIndexToEnd({context}) {
        context.set("activeIndex", 1)
      },
      setActiveIndexToStart({context}) {
        context.set("activeIndex", 0)
      },
      setDateValue({context, event, prop}) {
        if (!Array.isArray((event as DatePickerActionEvent).value)) {
          return
        }
        const value = (
          (event as DatePickerActionEvent).value as (DateValue | null)[]
        ).map((date) =>
          date == null ? date : constrainValue(date, prop("min"), prop("max")),
        )
        context.set(
          "value",
          normalizeValueForMode(value, prop("selectionMode") || "single"),
        )
      },
      setFocusedDate(params) {
        const {event}: {event: DatePickerActionEvent} = params
        const value = Array.isArray(event.value)
          ? event.value[0]
          : (event.value as DateValue)
        setFocusedValue(params, value)
      },
      setFocusedValueForView(params) {
        const {context, event} = params
        setFocusedValue(
          params,
          context.get("focusedValue").set({
            [context.get("view")]: (event as DatePickerActionEvent).value,
          }),
        )
      },
      setHoveredDate({context, event}) {
        context.set(
          "hoveredValue",
          (event as DatePickerActionEvent).value as DateValue,
        )
      },
      setHoveredValueIfKeyboard({context, event, prop}) {
        const isKeyboardNavigation =
          event.type.startsWith("TABLE.ARROW") ||
          [
            "TABLE.END",
            "TABLE.ENTER",
            "TABLE.HOME",
            "TABLE.PAGE_DOWN",
            "TABLE.PAGE_UP",
          ].includes(event.type)
        if (
          !isKeyboardNavigation ||
          prop("selectionMode") !== "range" ||
          !canPreviewRangeSelection(
            context.get("value"),
            context.get("activeIndex"),
          )
        ) {
          return
        }
        context.set("hoveredValue", context.get("focusedValue").copy())
      },
      setInputValue({context, event}) {
        const evt = event as DatePickerActionEvent
        if (evt.index == null) {
          return
        }
        context.set("inputValue", {
          index: evt.index,
          value: evt.value as string,
        })
      },
      setMinView({context, prop}) {
        context.set("view", prop("minView")!)
      },
      setNextView({context, prop}) {
        const nextView = getNextView(
          context.get("view"),
          prop("minView")!,
          prop("maxView")!,
        )
        context.set("view", nextView)
      },
      setPreviousView({context, prop}) {
        const prevView = getPreviousView(
          context.get("view"),
          prop("minView")!,
          prop("maxView")!,
        )
        context.set("view", prevView)
      },

      setRestoreFocus({context}) {
        context.set("restoreFocus", true)
      },

      setSelectedDate(params) {
        const {context, event} = params
        const values = Array.from(context.get("value"))
        const activeIndex = context.get("activeIndex")
        const existingValue = values[activeIndex]
        const newValue = normalizeValue(
          params,
          ((event as DatePickerActionEvent).value as DateValue) ??
            context.get("focusedValue"),
        )
        values[activeIndex] = preserveTime(existingValue, newValue)
        context.set("value", adjustStartAndEndDate(values))
      },

      setStartValue({computed, context, prop}) {
        const focusedValue = context.get("focusedValue")

        const outside = isDateOutsideRange(
          focusedValue,
          context.get("startValue"),
          computed("endValue"),
        )
        if (!outside) {
          return
        }

        const startValue = alignDate(
          focusedValue,
          "start",
          {months: prop("numOfMonths")},
          prop("locale")!,
        )
        context.set("startValue", startValue)
      },

      setView({context, event, prop}) {
        context.set(
          "view",
          clampView(
            (event as DatePickerActionEvent).view,
            prop("minView"),
            prop("maxView"),
          ),
        )
      },

      snapshotValue({context, refs}) {
        refs.set("valueSnapshot", Array.from(context.get("value")))
      },

      submitOwningForm({refs, scope}) {
        const pending = refs.get("pendingFormValueAsString")
        if (pending) {
          refs.set("pendingFormValueAsString", undefined)
          // the machine's rAF input sync is too late for a form serializing now
          writeInputElements(scope, pending)
        }
        const inputEl = getInputEls(scope)[0]
        const form =
          inputEl?.form ?? domEls.control(scope)?.closest("form") ?? undefined
        if (!form) {
          return
        }
        // mimic native submission by clicking the form's default button
        const submitter = getDefaultSubmitButton(form)
        if (submitter) {
          submitter.click()
          return
        }
        form.requestSubmit()
      },

      syncInputElement({computed, refs, scope}) {
        refs.get("syncInputElementCleanup")?.()
        const cleanup = raf(() => {
          writeInputElements(scope, computed("valueAsString"))
        })
        refs.set("syncInputElementCleanup", cleanup)
      },

      syncInputValue({context, scope}) {
        queueMicrotask(() => {
          const {index, value} = context.get("inputValue")
          setElementValue(getInputEls(scope)[index], value)
        })
      },

      togglePresets({context}) {
        context.set("presetsOpen", !context.get("presetsOpen"))
      },

      toggleSelectedDate(params) {
        const {context, event} = params
        const currentValue = normalizeValue(
          params,
          ((event as DatePickerActionEvent).value as DateValue) ??
            context.get("focusedValue"),
        )
        const index = context
          .get("value")
          .findIndex((date) => isDateEqual(date, currentValue))

        if (index === -1) {
          const values = [...context.get("value"), currentValue]
          context.set("value", sortDates(values))
        } else {
          const values = Array.from(context.get("value"))
          values.splice(index, 1)
          context.set("value", sortDates(values))
        }
      },

      toggleVisibility({event, prop, send}) {
        send({
          previousEvent: event,
          type: prop("open") ? "CONTROLLED.OPEN" : "CONTROLLED.CLOSE",
        })
      },
    },

    computed: {
      disabled: ({context, prop}) =>
        Boolean(prop("disabled")) || context.get("fieldsetDisabled"),
      endValue: ({computed, context}) =>
        getEndDate(context.get("startValue"), computed("visibleDuration")),
      isInteractive: ({computed, prop}) =>
        !computed("disabled") && !prop("readOnly"),
      isNextVisibleRangeValid: ({computed, prop}) =>
        !isNextRangeInvalid(computed("endValue"), prop("min"), prop("max")),
      isPrevVisibleRangeValid: ({context, prop}) =>
        !isPreviousRangeInvalid(
          context.get("startValue"),
          prop("min"),
          prop("max"),
        ),
      valueAsString({context, prop}) {
        return getValueAsString(context.get("value"), prop)
      },
      visibleDuration: ({prop}) => ({months: prop("numOfMonths")!}),
      visibleRange: ({computed, context}) => ({
        end: computed("endValue"),
        start: context.get("startValue"),
      }),
      visibleRangeText: ({computed, context, prop}) =>
        getVisibleRangeText({
          endValue: computed("endValue"),
          locale: prop("locale")!,
          startValue: context.get("startValue"),
          timeZone: prop("timeZone")!,
          view: context.get("view"),
        }),
    },

    context({bindable, getContext, prop}) {
      return {
        activeIndex: bindable(() => ({
          defaultValue: 0,
          sync: true,
        })),
        currentPlacement: bindable<Placement | undefined>(() => ({
          defaultValue: undefined,
        })),
        fieldsetDisabled: bindable<boolean>(() => ({defaultValue: false})),
        focusedValue: bindable<DateValue>(() => ({
          defaultValue: prop("defaultFocusedValue"),
          hash: (v) => v.toString(),
          isEqual: isDateEqual,
          onChange(focusedValue) {
            const context = getContext()
            const view = context.get("view")
            const value = context.get("value")
            const valueAsString = getValueAsString(value, prop)
            prop("onFocusChange")?.({focusedValue, value, valueAsString, view})
          },
          sync: true,
          value: prop("focusedValue"),
        })),
        hoveredValue: bindable<DateValue | null>(() => ({
          defaultValue: null,
          isEqual: isDateEqual,
        })),
        inputValue: bindable(() => ({
          defaultValue: {index: 0, value: ""},
          hash: (v) => `${v.index}:${v.value}`,
        })),
        presetsOpen: bindable(() => ({
          defaultValue: false,
        })),
        restoreFocus: bindable<boolean | undefined>(() => ({
          defaultValue: false,
          // written and read within one dismiss handler, so it cannot lag a render
          syncRead: true,
        })),
        startValue: bindable(() => {
          const focusedValue =
            prop("focusedValue") || prop("defaultFocusedValue")
          return {
            defaultValue: alignDate(
              focusedValue!,
              "start",
              {months: prop("numOfMonths")},
              prop("locale")!,
            ),
            hash: (v) => v.toString(),
            isEqual: isDateEqual,
          }
        }),
        value: bindable(() => ({
          defaultValue: prop("defaultValue"),
          hash: (v) => v.map((date) => date?.toString() ?? "").join(","),
          isEqual: isDateArrayEqual,
          onChange(value) {
            const context = getContext()
            const valueAsString = getValueAsString(value, prop)
            prop("onValueChange")?.({
              value,
              valueAsString,
              view: context.get("view"),
            })
          },
          value: prop("value"),
        })),
        view: bindable(() => ({
          defaultValue: prop("defaultView"),
          onChange(value) {
            prop("onViewChange")?.({view: value})
          },
          value: prop("view"),
        })),
      }
    },

    effects: {
      setupLiveRegion({refs, scope}) {
        const doc = scope.getDoc()
        refs.set(
          "announcer",
          createLiveRegion({document: doc, level: "polite"}),
        )
        return () => refs.get("announcer")?.destroy?.()
      },

      trackDismissableElement({context, prop, scope, send}) {
        if (prop("inline")) {
          return
        }

        const getContentEl = () => domEls.content(scope)
        return trackDismissableElement(getContentEl, {
          defer: true,
          exclude: [
            domEls.control(scope),
            ...getInputEls(scope),
            domEls.trigger(scope),
            domEls.clearTrigger(scope),
          ],
          onDismiss() {
            send({type: "INTERACT_OUTSIDE"})
          },
          onEscapeKeyDown(event) {
            event.preventDefault()
            send({src: "dismissable", type: "TABLE.ESCAPE"})
          },
          onInteractOutside(event) {
            context.set("restoreFocus", !event.detail.focusable)
          },
        })
      },

      trackFormControlState({context, prop, refs, scope}) {
        const anchorEl =
          getInputEls(scope)[0] ??
          domEls.control(scope) ??
          domEls.content(scope)
        return trackFormControl(anchorEl, {
          onFieldsetDisabledChange: (disabled) => {
            context.set("fieldsetDisabled", disabled)
          },
          onFormReset: () => {
            const mode = prop("selectionMode") || "single"
            const next = normalizeValueForMode(
              context.initial("value") ?? [],
              mode,
            )
            context.set("value", next)
            refs.set("valueSnapshot", Array.from(next))
            context.set("activeIndex", getNextActiveIndex(next, mode))
          },
        })
      },

      trackPositioning({context, prop, scope}) {
        if (prop("inline")) {
          return
        }

        if (!context.get("currentPlacement")) {
          context.set("currentPlacement", prop("positioning")!.placement)
        }
        const anchorEl = domEls.control(scope)
        const getPositionerEl = () => domEls.positioner(scope)
        return getPlacement(anchorEl, getPositionerEl, {
          ...prop("positioning"),
          defer: true,
          onComplete(data) {
            context.set("currentPlacement", data.placement)
          },
        })
      },

      trapFocus({prop, scope}) {
        if (prop("inline")) {
          return
        }

        return trapFocus([domEls.control(scope), domEls.content(scope)], {
          initialFocus: false,
          returnFocusOnDeactivate: false,
        })
      },
    },

    guards: {
      canPreviewRange: ({context, prop}) =>
        prop("selectionMode") === "range" &&
        canPreviewRangeSelection(
          context.get("value"),
          context.get("activeIndex"),
        ),
      canSelectDate: (params) => {
        const {context, event, prop} = params
        const maxSelectedDates = prop("maxSelectedDates")
        if (maxSelectedDates == null) {
          return true
        }
        const existingValues = context.get("value")
        // Normalize month/year cells numeric value to a DateValue
        const currentValue = normalizeValue(
          params,
          ((event as DatePickerActionEvent).value as DateValue | number) ??
            context.get("focusedValue"),
        )
        // Allow if deselecting (date already selected)
        const isDeselecting = existingValues.some((date) =>
          isDateEqual(date, currentValue),
        )
        if (isDeselecting) {
          return true
        }
        // Block if we've reached the maximum
        return existingValues.length < maxSelectedDates
      },
      closeOnSelect: ({prop}) => !!prop("closeOnSelect"),
      hasSelectedRange: ({context}) => {
        const value = context.get("value")
        return value.length === 2 && value[0] != null && value[1] != null
      },
      isAboveMinView: ({context, prop}) =>
        isAboveMinView(context.get("view"), prop("minView")!),
      isAcceptedResolution: ({event}: {event: DatePickerActionEvent}) =>
        event.resolution?.kind === "accepted",
      isDayPointerMoveOutsideVisibleMonth: ({event}) =>
        (event as DatePickerActionEvent).cell === "day" &&
        (event as DatePickerActionEvent).outsideRange === true,
      isDayView: ({context, event}) =>
        ((event as DatePickerActionEvent).view || context.get("view")) ===
        "day",
      isInputValueEmpty: ({event}: {event: DatePickerActionEvent}) =>
        typeof event.value === "string" && event.value.trim() === "",
      isInteractive: ({computed}) => computed("isInteractive"),
      isInteractOutsideEvent: ({event}: {event: DatePickerActionEvent}) =>
        event.previousEvent?.type === "INTERACT_OUTSIDE",
      isMonthView: ({context, event}) =>
        ((event as DatePickerActionEvent).view || context.get("view")) ===
        "month",
      isMultiPicker: ({prop}) => prop("selectionMode") === "multiple",
      isOpenControlled: ({prop}) =>
        prop("open") !== undefined || !!prop("inline"),
      isRangePicker: ({prop}) => prop("selectionMode") === "range",
      isYearView: ({context, event}) =>
        ((event as DatePickerActionEvent).view || context.get("view")) ===
        "year",
      selectsToMinView: ({prop}) => prop("viewOnSelect") === "min",
      shouldCloseOnEnter: ({context, event, prop}) => {
        const evt = event as DatePickerActionEvent
        if (evt.resolution?.kind !== "accepted" || !prop("closeOnSelect")) {
          return false
        }
        if (prop("selectionMode") !== "range") {
          return true
        }
        return context.get("value")[evt.index === 0 ? 1 : 0] != null
      },
      shouldFixOnBlur: ({event}) =>
        !!(event as DatePickerActionEvent).fixOnBlur,
      shouldRestoreFocus: ({context}) => !!context.get("restoreFocus"),
    },

    ids: ({bindableId, bindableIdCollection}) => {
      return {
        clearTrigger: bindableId<string>(),
        content: bindableId<string>(),
        control: bindableId<string>(),
        errorText: bindableId<string>(),
        hint: bindableId<string>(),
        input: bindableIdCollection<string>(),
        positioner: bindableId<string>(),
        trigger: bindableId<string>(),
      }
    },

    initialState({prop}) {
      const open = prop("inline") || (prop("open") ?? prop("defaultOpen"))
      return open ? "open" : "idle"
    },
    onDestroy: {
      actions: ["cancelSyncInputElement"],
    },
    onInit: {
      effects: ["setupLiveRegion", "trackFormControlState"],
    },

    props({props}) {
      const locale = props.locale || "en-US"
      const timeZone = props.timeZone || "UTC"
      const selectionMode = props.selectionMode || "single"
      const numOfMonths = props.numOfMonths || 1

      // Resolve calendar from locale when createCalendar is provided
      let calendar: Calendar | undefined
      if (props.createCalendar) {
        const resolved = new Intl.DateTimeFormat(locale).resolvedOptions()
        const calendarId = resolved.calendar as CalendarIdentifier
        if (calendarId !== "gregory" && calendarId !== "iso8601") {
          calendar = props.createCalendar(calendarId)
        }
      }

      // Helper to convert dates to resolved calendar
      const toTargetCalendar = (date: DateValue): DateValue => {
        if (!calendar) {
          return date
        }
        if (date.calendar.identifier === calendar.identifier) {
          return date
        }
        return toCalendar(date, calendar)
      }

      // sort, constrain, and normalize dates to the selection mode invariants
      const defaultValue = props.defaultValue
        ? normalizeValueForMode(
            sortDates(props.defaultValue).map((date) =>
              date == null
                ? date
                : constrainValue(toTargetCalendar(date), props.min, props.max),
            ),
            selectionMode,
          )
        : undefined
      const value = props.value
        ? normalizeValueForMode(
            sortDates(props.value).map((date) =>
              date == null
                ? date
                : constrainValue(toTargetCalendar(date), props.min, props.max),
            ),
            selectionMode,
          )
        : undefined

      // get initial focused value
      let focusedValue =
        props.focusedValue ||
        props.defaultFocusedValue ||
        value?.find((date) => date != null) ||
        defaultValue?.find((date) => date != null) ||
        getTodayDate(timeZone, calendar)
      focusedValue = constrainValue(
        toTargetCalendar(focusedValue),
        props.min,
        props.max,
      )

      // get the initial view
      const minView: DatePickerDateView = props.minView || "day"
      const maxView: DatePickerDateView = props.maxView || "year"
      const defaultView = clampView(
        props.defaultView || props.view || minView,
        minView,
        maxView,
      )

      return {
        closeOnSelect: true,
        dir: props.dir || "ltr",
        format(date, {locale, timeZone}) {
          const formatter = new DateFormatter(locale, {
            calendar: calendar?.identifier,
            day: "2-digit",
            month: "2-digit",
            timeZone,
            year: "numeric",
          })
          return formatter.format(date.toDate(timeZone))
        },
        locale,
        maxView,
        minView,
        numOfMonths,
        outsideDaySelectable: false,
        parse(value, {locale, timeZone}) {
          return parseDateString(value, locale, timeZone)
        },
        selectionMode,
        timeZone,
        viewOnSelect: "min",
        ...props,
        defaultFocusedValue: focusedValue,
        defaultValue: defaultValue ?? [],
        defaultView,
        focusedValue:
          typeof props.focusedValue === "undefined" ? undefined : focusedValue,
        positioning: {
          placement: "bottom-start",
          ...props.positioning,
        },
        value,
      }
    },

    refs() {
      return {
        announcer: undefined,
        pendingFormValueAsString: undefined,
        syncInputElementCleanup: undefined,
        valueSnapshot: undefined,
      }
    },

    // group: states
    on: {
      "FOCUS.SET": {
        actions: ["setFocusedDate"],
      },
      "GOTO.NEXT": [
        {
          actions: ["focusNextDecade", "announceVisibleRange"],
          guard: "isYearView",
        },
        {
          actions: ["focusNextYear", "announceVisibleRange"],
          guard: "isMonthView",
        },
        {
          actions: ["focusNextPage", "announceVisibleRange"],
        },
      ],
      "GOTO.PREV": [
        {
          actions: ["focusPreviousDecade", "announceVisibleRange"],
          guard: "isYearView",
        },
        {
          actions: ["focusPreviousYear", "announceVisibleRange"],
          guard: "isMonthView",
        },
        {
          actions: ["focusPreviousPage", "announceVisibleRange"],
        },
      ],
      "INPUT.BLUR": [
        {
          actions: [
            "setActiveIndexToStart",
            "resumeRangeSelection",
            "selectResolvedDate",
          ],
          guard: "shouldFixOnBlur",
        },
        {
          actions: ["setActiveIndexToStart", "resumeRangeSelection"],
        },
      ],
      "INPUT.CHANGE": [
        {
          actions: [
            "cancelSyncInputElement",
            "setInputValue",
            "clearDateValue",
            "clearFocusedDate",
          ],
          guard: "isInputValueEmpty",
        },
        {
          actions: [
            "cancelSyncInputElement",
            "setInputValue",
            "focusParsedDate",
          ],
        },
      ],
      "INPUT.ENTER": [
        {
          actions: [
            "focusResolvedDate",
            "selectResolvedDate",
            "submitOwningForm",
          ],
          guard: or("isAcceptedResolution", "isInputValueEmpty"),
        },
        {
          actions: ["focusResolvedDate", "selectResolvedDate"],
        },
      ],
      "INPUT.FOCUS": {
        actions: ["setActiveIndex"],
      },
      "PRESET.CLICK": [
        {
          actions: [
            "setDateValue",
            "setFocusedDate",
            "closePresets",
            "invokeOnClose",
            "setRestoreFocus",
          ],
          guard: and("closeOnSelect", "isOpenControlled"),
        },
        {
          actions: [
            "setDateValue",
            "setFocusedDate",
            "closePresets",
            "focusInputElement",
          ],
          guard: "closeOnSelect",
          target: "focused",
        },
        {
          actions: [
            "setDateValue",
            "setFocusedDate",
            "closePresets",
            "focusActiveCell",
          ],
        },
      ],
      "PRESET.TOGGLE": {
        actions: ["togglePresets"],
      },
      "VALUE.CLEAR": {
        actions: [
          "clearDateValue",
          "clearFocusedDate",
          "setActiveIndexToStart",
          "clearHoveredDate",
          "focusFirstInputElement",
        ],
      },
      "VALUE.SET": {
        actions: ["setDateValue", "setFocusedDate"],
      },
      "VALUE.TOGGLE": {
        actions: ["toggleSelectedDate"],
        guard: and("isMultiPicker", "isInteractive"),
      },
      "VIEW.SET": {
        actions: ["setView"],
      },
    },

    states: {
      focused: {
        on: {
          "CONTROLLED.OPEN": {
            actions: ["resetView", "focusFirstSelectedDate", "focusActiveCell"],
            target: "open",
          },
          OPEN: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "resetView",
                "focusFirstSelectedDate",
                "focusActiveCell",
                "invokeOnOpen",
              ],
              target: "open",
            },
          ],
          "TRIGGER.CLICK": [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "resetView",
                "focusFirstSelectedDate",
                "focusActiveCell",
                "invokeOnOpen",
              ],
              target: "open",
            },
          ],
        },
        tags: ["closed"],
      },

      idle: {
        on: {
          "CONTROLLED.OPEN": {
            actions: ["resetView", "focusFirstSelectedDate", "focusActiveCell"],
            target: "open",
          },
          OPEN: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "resetView",
                "focusFirstSelectedDate",
                "focusActiveCell",
                "invokeOnOpen",
              ],
              target: "open",
            },
          ],
          "TRIGGER.CLICK": [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "resetView",
                "focusFirstSelectedDate",
                "focusActiveCell",
                "invokeOnOpen",
              ],
              target: "open",
            },
          ],
        },
        tags: ["closed"],
      },

      open: {
        effects: ["trackDismissableElement", "trackPositioning", "trapFocus"],
        entry: [
          "snapshotValue",
          "resumeRangeSelection",
          "closePresets",
          "clearRestoreFocus",
        ],
        exit: ["clearHoveredDate"],
        on: {
          CANCEL: [
            {
              actions: [
                "restoreSnapshot",
                "setActiveIndexToStart",
                "invokeOnClose",
                "setRestoreFocus",
              ],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "restoreSnapshot",
                "setActiveIndexToStart",
                "invokeOnClose",
                "focusInputElement",
              ],
              target: "focused",
            },
          ],
          "CELL.CLICK": [
            {
              actions: ["setFocusedValueForView", "setMinView"],
              guard: and("isAboveMinView", "selectsToMinView"),
            },
            {
              actions: ["setFocusedValueForView", "setPreviousView"],
              guard: "isAboveMinView",
            },
            {
              actions: [
                "setActiveIndexToStart",
                "resetSelection",
                "setActiveIndexToEnd",
              ],
              guard: and("isRangePicker", "hasSelectedRange"),
            },
            // === Grouped transitions (based on `closeOnSelect` and
            // `isOpenControlled`) ===
            {
              actions: [
                "setFocusedDate",
                "setSelectedDate",
                "setActiveIndexToStart",
                "clearHoveredDate",
                "invokeOnClose",
                "setRestoreFocus",
              ],
              guard: and(
                "isRangePicker",
                "canPreviewRange",
                "closeOnSelect",
                "isOpenControlled",
              ),
            },
            {
              actions: [
                "setFocusedDate",
                "setSelectedDate",
                "setActiveIndexToStart",
                "clearHoveredDate",
                "invokeOnClose",
                "focusInputElement",
              ],
              guard: and("isRangePicker", "canPreviewRange", "closeOnSelect"),
              target: "focused",
            },
            {
              actions: [
                "setFocusedDate",
                "setSelectedDate",
                "setActiveIndexToStart",
                "clearHoveredDate",
              ],
              guard: and("isRangePicker", "canPreviewRange"),
            },
            // ===
            {
              actions: [
                "setFocusedDate",
                "setSelectedDate",
                "setActiveIndexToEnd",
              ],
              guard: "isRangePicker",
            },
            {
              actions: ["setFocusedDate", "toggleSelectedDate"],
              guard: and("isMultiPicker", "canSelectDate"),
            },
            {
              actions: ["setFocusedDate"],
              guard: "isMultiPicker",
            },
            // === Grouped transitions (based on `closeOnSelect` and
            // `isOpenControlled`) ===
            {
              actions: [
                "setFocusedDate",
                "setSelectedDate",
                "invokeOnClose",
                "setRestoreFocus",
              ],
              guard: and("closeOnSelect", "isOpenControlled"),
            },
            {
              actions: [
                "setFocusedDate",
                "setSelectedDate",
                "invokeOnClose",
                "focusInputElement",
              ],
              guard: "closeOnSelect",
              target: "focused",
            },
            {
              actions: ["setFocusedDate", "setSelectedDate"],
            },
            // ===
          ],
          "CELL.POINTER_MOVE": [
            {
              actions: ["setHoveredDate"],
              guard: and(
                "canPreviewRange",
                "isDayPointerMoveOutsideVisibleMonth",
              ),
            },
            {
              actions: ["setHoveredDate", "setFocusedDate"],
              guard: "canPreviewRange",
            },
          ],
          CLOSE: [
            {
              actions: [
                "setActiveIndexToStart",
                "invokeOnClose",
                "setRestoreFocus",
              ],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "setActiveIndexToStart",
                "invokeOnClose",
                "focusInputElement",
              ],
              target: "focused",
            },
          ],
          "CONTROLLED.CLOSE": [
            {
              actions: ["focusTriggerElement"],
              guard: and("shouldRestoreFocus", "isInteractOutsideEvent"),
              target: "focused",
            },
            {
              actions: ["focusInputElement"],
              guard: "shouldRestoreFocus",
              target: "focused",
            },
            {
              target: "idle",
            },
          ],
          "INPUT.ENTER": [
            {
              actions: [
                "focusResolvedDate",
                "selectResolvedDate",
                "invokeOnClose",
                "setRestoreFocus",
                "submitOwningForm",
              ],
              guard: and("shouldCloseOnEnter", "isOpenControlled"),
            },
            {
              actions: [
                "focusResolvedDate",
                "selectResolvedDate",
                "invokeOnClose",
                "focusInputElement",
                "submitOwningForm",
              ],
              guard: "shouldCloseOnEnter",
              target: "focused",
            },
            {
              actions: [
                "focusResolvedDate",
                "selectResolvedDate",
                "submitOwningForm",
              ],
              guard: and(
                or("isAcceptedResolution", "isInputValueEmpty"),
                "closeOnSelect",
              ),
            },
            {
              actions: ["focusResolvedDate", "selectResolvedDate"],
            },
          ],
          INTERACT_OUTSIDE: [
            // acts like Cancel if closeOnSelect === false
            {
              actions: [
                "restoreSnapshot",
                "setActiveIndexToStart",
                "invokeOnClose",
              ],
              guard: and(not("closeOnSelect"), "isOpenControlled"),
            },
            {
              actions: [
                "restoreSnapshot",
                "setActiveIndexToStart",
                "invokeOnClose",
                "focusTriggerElement",
              ],
              guard: and(not("closeOnSelect"), "shouldRestoreFocus"),
              target: "focused",
            },
            {
              actions: [
                "restoreSnapshot",
                "setActiveIndexToStart",
                "invokeOnClose",
              ],
              guard: not("closeOnSelect"),
              target: "idle",
            },
            {
              actions: ["setActiveIndexToStart", "invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "setActiveIndexToStart",
                "invokeOnClose",
                "focusTriggerElement",
              ],
              guard: "shouldRestoreFocus",
              target: "focused",
            },
            {
              actions: ["setActiveIndexToStart", "invokeOnClose"],
              target: "idle",
            },
          ],
          "TABLE.ARROW_DOWN": [
            {
              actions: ["focusNextMonthColumn"],
              guard: "isMonthView",
            },
            {
              actions: ["focusNextYearColumn"],
              guard: "isYearView",
            },
            {
              actions: ["focusNextWeek"],
            },
          ],
          "TABLE.ARROW_LEFT": [
            {
              actions: ["focusPreviousMonth"],
              guard: "isMonthView",
            },
            {
              actions: ["focusPreviousYear"],
              guard: "isYearView",
            },
            {
              actions: ["focusPreviousDay"],
            },
          ],
          "TABLE.ARROW_RIGHT": [
            {
              actions: ["focusNextMonth"],
              guard: "isMonthView",
            },
            {
              actions: ["focusNextYear"],
              guard: "isYearView",
            },
            {
              actions: ["focusNextDay"],
            },
          ],
          "TABLE.ARROW_UP": [
            {
              actions: ["focusPreviousMonthColumn"],
              guard: "isMonthView",
            },
            {
              actions: ["focusPreviousYearColumn"],
              guard: "isYearView",
            },
            {
              actions: ["focusPreviousWeek"],
            },
          ],
          "TABLE.END": [
            {
              actions: ["focusLastMonth"],
              guard: "isMonthView",
            },
            {
              actions: ["focusLastYear"],
              guard: "isYearView",
            },
            {
              actions: ["focusSectionEnd"],
            },
          ],
          "TABLE.ENTER": [
            {
              actions: ["setMinView"],
              guard: and("isAboveMinView", "selectsToMinView"),
            },
            {
              actions: ["setPreviousView"],
              guard: "isAboveMinView",
            },
            {
              actions: [
                "setActiveIndexToStart",
                "resetSelection",
                "setActiveIndexToEnd",
                "focusNextDay",
              ],
              guard: and("isRangePicker", "hasSelectedRange"),
            },
            // === Grouped transitions (based on `closeOnSelect` and
            // `isOpenControlled`) ===
            {
              actions: [
                "setSelectedDate",
                "setActiveIndexToStart",
                "clearHoveredDate",
                "invokeOnClose",
                "setRestoreFocus",
              ],
              guard: and(
                "isRangePicker",
                "canPreviewRange",
                "closeOnSelect",
                "isOpenControlled",
              ),
            },
            {
              actions: [
                "setSelectedDate",
                "setActiveIndexToStart",
                "clearHoveredDate",
                "invokeOnClose",
                "focusInputElement",
              ],
              guard: and("isRangePicker", "canPreviewRange", "closeOnSelect"),
              target: "focused",
            },
            {
              actions: [
                "setSelectedDate",
                "setActiveIndexToStart",
                "clearHoveredDate",
              ],
              guard: and("isRangePicker", "canPreviewRange"),
            },
            // ===
            {
              actions: [
                "setSelectedDate",
                "setActiveIndexToEnd",
                "focusNextDay",
              ],
              guard: "isRangePicker",
            },
            {
              actions: ["toggleSelectedDate"],
              guard: and("isMultiPicker", "canSelectDate"),
            },
            {
              guard: "isMultiPicker",
            },
            // === Grouped transitions (based on `closeOnSelect` and
            // `isOpenControlled`) ===
            {
              actions: [
                "selectFocusedDate",
                "invokeOnClose",
                "setRestoreFocus",
              ],
              guard: and("closeOnSelect", "isOpenControlled"),
            },
            {
              actions: [
                "selectFocusedDate",
                "invokeOnClose",
                "focusInputElement",
              ],
              guard: "closeOnSelect",
              target: "focused",
            },
            {
              actions: ["selectFocusedDate"],
            },
            // ===
          ],
          "TABLE.ESCAPE": [
            {
              actions: [
                "restoreSnapshot",
                "setActiveIndexToStart",
                "focusFirstSelectedDate",
                "invokeOnClose",
                "setRestoreFocus",
              ],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "restoreSnapshot",
                "setActiveIndexToStart",
                "focusFirstSelectedDate",
                "invokeOnClose",
                "focusTriggerElement",
              ],
              target: "focused",
            },
          ],
          "TABLE.HOME": [
            {
              actions: ["focusFirstMonth"],
              guard: "isMonthView",
            },
            {
              actions: ["focusFirstYear"],
              guard: "isYearView",
            },
            {
              actions: ["focusSectionStart"],
            },
          ],
          "TABLE.PAGE_DOWN": {
            actions: ["focusNextSection"],
          },
          "TABLE.PAGE_UP": {
            actions: ["focusPreviousSection"],
          },
          "TABLE.POINTER_DOWN": {
            actions: ["disableTextSelection"],
          },
          "TABLE.POINTER_LEAVE": {
            actions: ["clearHoveredDate"],
            guard: "isRangePicker",
          },
          "TABLE.POINTER_UP": {
            actions: ["enableTextSelection"],
          },
          "TRIGGER.CLICK": [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose"],
              target: "focused",
            },
          ],
          "VIEW.TOGGLE": {
            actions: ["setNextView"],
          },
        },
        tags: ["open"],
      },
    },

    watch({action, computed, context, prop, track}) {
      track([() => prop("locale")], () => {
        action(["setStartValue", "syncInputElement"])
      })

      track([() => context.hash("focusedValue")], () => {
        action([
          "setStartValue",
          "focusActiveCellIfNeeded",
          "setHoveredValueIfKeyboard",
        ])
      })

      track([() => context.hash("startValue")], () => {
        action(["invokeOnVisibleRangeChange"])
      })

      track([() => context.hash("inputValue")], () => {
        action(["syncInputValue"])
      })

      track([() => context.hash("value")], () => {
        action(["syncInputElement"])
      })

      track([() => computed("valueAsString").toString()], () => {
        action(["announceValueText"])
      })

      track([() => context.get("view")], () => {
        action(["focusActiveCell"])
      })

      track([() => prop("open")], () => {
        action(["toggleVisibility"])
      })

      track([() => prop("selectionMode")], () => {
        action(["adjustValueToSelectionMode"])
      })
    },
  })

const normalizeValue = (
  ctx: Params<DatePickerSchema>,
  value: number | DateValue,
) => {
  const {context, prop} = ctx
  const view = context.get("view")
  let dateValue =
    typeof value === "number"
      ? context.get("focusedValue").set({[view]: value})
      : value
  eachView((view) => {
    // normalize month and day
    if (isBelowMinView(view, prop("minView")!)) {
      dateValue = dateValue.set({[view]: view === "day" ? 1 : 0})
    }
  })
  return dateValue
}

/**
 * Preserves time components from an existing date when setting a new date.
 * - If existing date is a ZonedDateTime, preserves both time and timezone
 * - If existing date is a CalendarDateTime, preserves time only
 * - If existing date has no time, returns the new date as-is
 */
const preserveTime = (
  existingDate: DateValue | null | undefined,
  newDate: DateValue,
): DateValue => {
  if (!existingDate || !("hour" in existingDate)) {
    return newDate
  }

  // Check if existing date is a ZonedDateTime (has timezone)
  const isZoned = "timeZone" in existingDate

  // Convert CalendarDate to appropriate type if needed
  let dateWithTime: DateValue = newDate
  if (!("hour" in newDate)) {
    if (isZoned) {
      // Convert to ZonedDateTime with same timezone as existing
      dateWithTime = toZoned(toCalendarDateTime(newDate), existingDate.timeZone)
    } else {
      // Convert to CalendarDateTime
      dateWithTime = toCalendarDateTime(newDate)
    }
  }

  // Copy time components from existing date to new date
  return dateWithTime.set({
    hour: existingDate.hour,
    millisecond: existingDate.millisecond,
    minute: existingDate.minute,
    second: existingDate.second,
  })
}

function setFocusedValue(
  ctx: Params<DatePickerSchema>,
  mixedValue: DateValue | number | null | undefined,
) {
  const {computed, context, prop} = ctx
  if (!mixedValue) {
    return
  }

  const value = normalizeValue(ctx, mixedValue)
  if (isDateEqual(context.get("focusedValue"), value)) {
    return
  }

  const adjustFn = getAdjustedDateFn(
    computed("visibleDuration"),
    prop("locale")!,
    prop("min"),
    prop("max"),
  )
  const adjustedValue = adjustFn({
    focusedDate: value,
    startDate: context.get("startValue"),
  })

  context.set("startValue", adjustedValue.startDate)
  context.set("focusedValue", adjustedValue.focusedDate)
}

function setAdjustedValue(
  ctx: Params<DatePickerSchema>,
  value: AdjustDateReturn,
) {
  const {context} = ctx
  context.set("startValue", value.startDate)
  const focusedValue = context.get("focusedValue")
  if (isDateEqual(focusedValue, value.focusedDate)) {
    return
  }
  context.set("focusedValue", value.focusedDate)
}
