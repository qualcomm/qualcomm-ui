// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import dayjs, {type Dayjs} from "dayjs"

/**
 * Get the start of a month
 */
export function getMonthStart(date: Date): Date {
  return dayjs(date).startOf("month").toDate()
}

/**
 * Get the end of a month
 */
export function getMonthEnd(date: Date): Date {
  return dayjs(date).endOf("month").toDate()
}

/**
 * Get the start of a week
 */
export function getWeekStart(date: Date): Date {
  return dayjs(date).startOf("week").toDate()
}

/**
 * Get the end of a week
 */
export function getWeekEnd(date: Date): Date {
  return dayjs(date).endOf("week").toDate()
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  return dayjs(date).add(days, "day").toDate()
}

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date {
  return dayjs(date).add(months, "month").toDate()
}

/**
 * Add years to a date
 */
export function addYears(date: Date, years: number): Date {
  return dayjs(date).add(years, "year").toDate()
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false
  return dayjs(date1).isSame(date2, "day")
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return dayjs(date).isSame(dayjs(), "day")
}

/**
 * Check if a date is before another date
 */
export function isBefore(date: Date, compareDate: Date): boolean {
  return dayjs(date).isBefore(compareDate, "day")
}

/**
 * Check if a date is after another date
 */
export function isAfter(date: Date, compareDate: Date): boolean {
  return dayjs(date).isAfter(compareDate, "day")
}

/**
 * Check if a date is within a range (inclusive)
 */
export function isInRange(
  date: Date,
  min: Date | undefined,
  max: Date | undefined,
): boolean {
  if (min && isBefore(date, min)) return false
  if (max && isAfter(date, max)) return false
  return true
}

/**
 * Format a date using a format string
 */
export function formatDate(
  date: Date | null,
  format: string,
  locale?: string,
): string {
  if (!date) return ""
  let dayjsDate: Dayjs = dayjs(date)
  if (locale) {
    dayjsDate = dayjsDate.locale(locale)
  }
  return dayjsDate.format(format)
}

/**
 * Parse a date string using a format
 */
export function parseDate(
  dateString: string,
  format: string,
  locale?: string,
): Date | null {
  if (!dateString) return null
  let parsed = dayjs(dateString, format)
  if (locale) {
    parsed = parsed.locale(locale)
  }
  return parsed.isValid() ? parsed.toDate() : null
}

/**
 * Get all dates to display in a calendar view for a given month
 * Includes dates from previous and next months to fill the grid
 */
export function getCalendarDates(date: Date): Date[] {
  const monthStart = getMonthStart(date)
  const monthEnd = getMonthEnd(date)
  const calendarStart = getWeekStart(monthStart)
  const calendarEnd = getWeekEnd(monthEnd)

  const dates: Date[] = []
  let current = calendarStart

  while (!isAfter(current, calendarEnd)) {
    dates.push(current)
    current = addDays(current, 1)
  }

  return dates
}

/**
 * Check if a date is in the current viewing month
 */
export function isInMonth(date: Date, viewingMonth: Date): boolean {
  return dayjs(date).isSame(viewingMonth, "month")
}

/**
 * Get a unique string representation of a date for use as an ID
 */
export function getDateId(date: Date): string {
  return dayjs(date).format("YYYY-MM-DD")
}

/**
 * Get the current date (today)
 */
export function getToday(): Date {
  return dayjs().toDate()
}

/**
 * Get month name
 */
export function getMonthName(date: Date, locale?: string): string {
  let dayjsDate: Dayjs = dayjs(date)
  if (locale) {
    dayjsDate = dayjsDate.locale(locale)
  }
  return dayjsDate.format("MMMM")
}

/**
 * Get year
 */
export function getYear(date: Date): number {
  return dayjs(date).year()
}

/**
 * Get day of month
 */
export function getDayOfMonth(date: Date): number {
  return dayjs(date).date()
}
