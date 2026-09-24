// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type DateDuration,
  type DateValue,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "@internationalized/date"

import {isDateOutsideRange} from "./assertion.js"
import {
  alignEnd,
  alignStart,
  constrainStart,
  constrainValue,
} from "./constrain.js"
import {getEndDate, getUnitDuration} from "./duration.js"

export interface AdjustDateParams {
  focusedDate: DateValue
  startDate: DateValue
}

export interface AdjustDateReturn extends AdjustDateParams {
  endDate: DateValue
}

export function getAdjustedDateFn(
  visibleDuration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue,
) {
  return function getDate(options: AdjustDateParams): AdjustDateReturn {
    const {focusedDate, startDate} = options
    const endDate = getEndDate(startDate, visibleDuration)

    // If the focused date was moved to an invalid value, it can't be focused, so
    // constrain it.
    if (isDateOutsideRange(focusedDate, minValue, maxValue)) {
      return {
        endDate,
        focusedDate: constrainValue(focusedDate, minValue, maxValue),
        startDate,
      }
    }

    if (focusedDate.compare(startDate) < 0) {
      return {
        endDate,
        focusedDate: constrainValue(focusedDate, minValue, maxValue),
        startDate: alignEnd(
          focusedDate,
          visibleDuration,
          locale,
          minValue,
          maxValue,
        ),
      }
    }

    if (focusedDate.compare(endDate) > 0) {
      return {
        endDate,
        focusedDate: constrainValue(focusedDate, minValue, maxValue),
        startDate: alignStart(
          focusedDate,
          visibleDuration,
          locale,
          minValue,
          maxValue,
        ),
      }
    }

    return {
      endDate,
      focusedDate: constrainValue(focusedDate, minValue, maxValue),
      startDate,
    }
  }
}

/** Get next and previous page (for date range) */
export function getNextPage(
  focusedDate: DateValue,
  startDate: DateValue,
  visibleDuration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue,
): AdjustDateReturn {
  const adjust = getAdjustedDateFn(visibleDuration, locale, minValue, maxValue)
  const start = startDate.add(visibleDuration)

  return adjust({
    focusedDate: focusedDate.add(visibleDuration),
    startDate: alignStart(
      constrainStart(
        focusedDate,
        start,
        visibleDuration,
        locale,
        minValue,
        maxValue,
      ),
      visibleDuration,
      locale,
    ),
  })
}

export function getPreviousPage(
  focusedDate: DateValue,
  startDate: DateValue,
  visibleDuration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue,
): AdjustDateReturn {
  const adjust = getAdjustedDateFn(visibleDuration, locale, minValue, maxValue)
  const start = startDate.subtract(visibleDuration)

  return adjust({
    focusedDate: focusedDate.subtract(visibleDuration),
    startDate: alignStart(
      constrainStart(
        focusedDate,
        start,
        visibleDuration,
        locale,
        minValue,
        maxValue,
      ),
      visibleDuration,
      locale,
    ),
  })
}

/** Get the next and previous row (for date range) */
export function getNextRow(
  focusedDate: DateValue,
  startDate: DateValue,
  visibleDuration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue,
): AdjustDateReturn | undefined {
  const adjust = getAdjustedDateFn(visibleDuration, locale, minValue, maxValue)

  if (visibleDuration.days) {
    return getNextPage(
      focusedDate,
      startDate,
      visibleDuration,
      locale,
      minValue,
      maxValue,
    )
  }

  if (
    visibleDuration.weeks ||
    visibleDuration.months ||
    visibleDuration.years
  ) {
    return adjust({
      focusedDate: focusedDate.add({weeks: 1}),
      startDate,
    })
  }
}

export function getPreviousRow(
  focusedDate: DateValue,
  startDate: DateValue,
  visibleDuration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue,
): AdjustDateReturn | undefined {
  const adjust = getAdjustedDateFn(visibleDuration, locale, minValue, maxValue)

  if (visibleDuration.days) {
    return getPreviousPage(
      focusedDate,
      startDate,
      visibleDuration,
      locale,
      minValue,
      maxValue,
    )
  }

  if (
    visibleDuration.weeks ||
    visibleDuration.months ||
    visibleDuration.years
  ) {
    return adjust({
      focusedDate: focusedDate.subtract({weeks: 1}),
      startDate,
    })
  }
}

/** Get start and end date for a date section */
export function getSectionStart(
  focusedDate: DateValue,
  startDate: DateValue,
  visibleDuration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue,
): AdjustDateReturn | undefined {
  const adjust = getAdjustedDateFn(visibleDuration, locale, minValue, maxValue)

  if (visibleDuration.days) {
    return adjust({
      focusedDate: startDate,
      startDate,
    })
  }

  if (visibleDuration.weeks) {
    return adjust({
      focusedDate: startOfWeek(focusedDate, locale),
      startDate,
    })
  }

  if (visibleDuration.months || visibleDuration.years) {
    return adjust({
      focusedDate: startOfMonth(focusedDate),
      startDate,
    })
  }
}

export function getSectionEnd(
  focusedDate: DateValue,
  startDate: DateValue,
  visibleDuration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue,
): AdjustDateReturn | undefined {
  const adjust = getAdjustedDateFn(visibleDuration, locale, minValue, maxValue)
  const endDate = getEndDate(startDate, visibleDuration)

  if (visibleDuration.days) {
    return adjust({
      focusedDate: endDate,
      startDate,
    })
  }

  if (visibleDuration.weeks) {
    return adjust({
      focusedDate: endOfWeek(focusedDate, locale),
      startDate,
    })
  }

  if (visibleDuration.months || visibleDuration.years) {
    return adjust({
      focusedDate: endOfMonth(focusedDate),
      startDate,
    })
  }
}

export function getNextSection(
  focusedDate: DateValue,
  startDate: DateValue,
  larger: boolean,
  visibleDuration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue,
): AdjustDateReturn | undefined {
  const adjust = getAdjustedDateFn(visibleDuration, locale, minValue, maxValue)

  if (!larger && !visibleDuration.days) {
    return adjust({
      focusedDate: focusedDate.add(getUnitDuration(visibleDuration)),
      startDate,
    })
  }

  if (visibleDuration.days) {
    return getNextPage(
      focusedDate,
      startDate,
      visibleDuration,
      locale,
      minValue,
      maxValue,
    )
  }

  if (visibleDuration.weeks) {
    return adjust({
      focusedDate: focusedDate.add({months: 1}),
      startDate,
    })
  }

  if (visibleDuration.months || visibleDuration.years) {
    return adjust({
      focusedDate: focusedDate.add({years: 1}),
      startDate,
    })
  }
}

export function getPreviousSection(
  focusedDate: DateValue,
  startDate: DateValue,
  larger: boolean,
  visibleDuration: DateDuration,
  locale: string,
  minValue?: DateValue,
  maxValue?: DateValue,
): AdjustDateReturn | undefined {
  const adjust = getAdjustedDateFn(visibleDuration, locale, minValue, maxValue)

  if (!larger && !visibleDuration.days) {
    return adjust({
      focusedDate: focusedDate.subtract(getUnitDuration(visibleDuration)),
      startDate,
    })
  }

  if (visibleDuration.days) {
    return getPreviousPage(
      focusedDate,
      startDate,
      visibleDuration,
      locale,
      minValue,
      maxValue,
    )
  }

  if (visibleDuration.weeks) {
    return adjust({
      focusedDate: focusedDate.subtract({months: 1}),
      startDate,
    })
  }

  if (visibleDuration.months || visibleDuration.years) {
    return adjust({
      focusedDate: focusedDate.subtract({years: 1}),
      startDate,
    })
  }
}
