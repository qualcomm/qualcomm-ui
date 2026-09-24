import {CalendarDate, parseDate} from "@internationalized/date"
import {describe, expect, test} from "vitest"

import {
  adjustStartAndEndDate,
  clampView,
  eachView,
  getInputPlaceholder,
  getNextView,
  getPreviousView,
  getRoleDescription,
  getVisibleRangeText,
  isAboveMinView,
  isBelowMinView,
  isDateWithinRange,
  isValidDate,
  normalizeValueForMode,
  sortDates,
} from "../date-picker.utils.js"

describe("sortDates", () => {
  test("sorts dates in ascending order within a month", () => {
    const date1 = parseDate("2024-01-15")
    const date2 = parseDate("2024-01-20")
    const date3 = parseDate("2024-01-10")

    const sorted = sortDates([date1, date2, date3])
    expect(sorted).toEqual([date3, date1, date2])
  })

  test("orders by month, not by day of month", () => {
    const january = parseDate("2024-01-30")
    const february = parseDate("2024-02-10")
    const december = parseDate("2024-12-05")

    const sorted = sortDates([december, february, january])
    expect(sorted).toEqual([january, february, december])
  })

  test("orders by year, not by month or day", () => {
    const y2023 = parseDate("2023-12-31")
    const y2024 = parseDate("2024-06-15")
    const y2025 = parseDate("2025-01-01")

    const sorted = sortDates([y2025, y2023, y2024])
    expect(sorted).toEqual([y2023, y2024, y2025])
  })

  test("returns the array unsorted when it contains a null", () => {
    const date1 = parseDate("2024-01-20")
    const date2 = parseDate("2024-01-10")

    expect(sortDates([date1, null, date2])).toEqual([date1, null, date2])
  })

  test("does not mutate the original array", () => {
    const date1 = parseDate("2024-01-15")
    const date2 = parseDate("2024-01-20")
    const values = [date2, date1]
    const original = [...values]

    sortDates(values)
    expect(values).toEqual(original)
  })
})

describe("adjustStartAndEndDate", () => {
  test("returns value as-is when dates are already in order", () => {
    const start = parseDate("2024-01-10")
    const end = parseDate("2024-01-20")

    expect(adjustStartAndEndDate([start, end])).toEqual([start, end])
  })

  test("swaps dates when the end date is before the start date", () => {
    const start = parseDate("2024-01-20")
    const end = parseDate("2024-01-10")

    expect(adjustStartAndEndDate([start, end])).toEqual([end, start])
  })

  test("swaps across a year boundary even when the day of month is larger", () => {
    const start = parseDate("2025-01-01")
    const end = parseDate("2024-12-31")

    expect(adjustStartAndEndDate([start, end])).toEqual([end, start])
  })

  test("returns value as-is when either endpoint is null", () => {
    const date = parseDate("2024-01-20")

    expect(adjustStartAndEndDate([null, date])).toEqual([null, date])
    expect(adjustStartAndEndDate([date, null])).toEqual([date, null])
    expect(adjustStartAndEndDate([null, null])).toEqual([null, null])
  })
})

describe("normalizeValueForMode", () => {
  const a = parseDate("2024-01-10")
  const b = parseDate("2024-01-20")
  const c = parseDate("2024-01-30")

  test("single keeps only the first non-null date", () => {
    expect(normalizeValueForMode([null, a, b], "single")).toEqual([a])
  })

  test("multiple drops nulls but keeps all remaining dates", () => {
    expect(normalizeValueForMode([a, null, b, null, c], "multiple")).toEqual([
      a,
      b,
      c,
    ])
  })

  test("range preserves a positional hole rather than collapsing it", () => {
    expect(normalizeValueForMode([null, b], "range")).toEqual([null, b])
  })

  test("range truncates to two endpoints and orders them", () => {
    expect(normalizeValueForMode([c, a, b], "range")).toEqual([a, c])
  })

  test("range orders a reversed pair", () => {
    expect(normalizeValueForMode([c, a], "range")).toEqual([a, c])
  })

  test("range preserves a hole rather than ordering around it", () => {
    expect(normalizeValueForMode([null, a], "range")).toEqual([null, a])
    expect(normalizeValueForMode([a, null], "range")).toEqual([a, null])
    expect(normalizeValueForMode([], "range")).toEqual([])
    expect(normalizeValueForMode([a], "range")).toEqual([a])
  })

  test("single and multiple keep dates in the given order", () => {
    expect(normalizeValueForMode([c, a], "single")).toEqual([c])
    expect(normalizeValueForMode([c, a, b], "multiple")).toEqual([c, a, b])
  })
})

describe("isDateWithinRange", () => {
  const start = parseDate("2024-01-10")
  const end = parseDate("2024-01-20")

  test("returns true when the date is inside the range", () => {
    expect(isDateWithinRange(parseDate("2024-01-15"), [start, end])).toBe(true)
  })

  test("returns false when the date is outside the range", () => {
    expect(isDateWithinRange(parseDate("2024-01-05"), [start, end])).toBe(false)
    expect(isDateWithinRange(parseDate("2024-01-25"), [start, end])).toBe(false)
  })

  test("treats both endpoints as inclusive", () => {
    expect(isDateWithinRange(start, [start, end])).toBe(true)
    expect(isDateWithinRange(end, [start, end])).toBe(true)
    expect(isDateWithinRange(parseDate("2024-01-09"), [start, end])).toBe(false)
    expect(isDateWithinRange(parseDate("2024-01-21"), [start, end])).toBe(false)
  })

  test("returns false when either endpoint is null", () => {
    const date = parseDate("2024-01-15")
    expect(isDateWithinRange(date, [null, end])).toBe(false)
    expect(isDateWithinRange(date, [start, null])).toBe(false)
    expect(isDateWithinRange(date, [null, null])).toBe(false)
  })

  test("spans month and year boundaries", () => {
    const range = [parseDate("2024-11-20"), parseDate("2025-02-10")]

    expect(isDateWithinRange(parseDate("2024-12-31"), range)).toBe(true)
    expect(isDateWithinRange(parseDate("2025-01-05"), range)).toBe(true)
    expect(isDateWithinRange(parseDate("2024-11-19"), range)).toBe(false)
    expect(isDateWithinRange(parseDate("2025-02-11"), range)).toBe(false)
  })
})

describe("isValidDate", () => {
  test("returns true for a real date", () => {
    expect(isValidDate(parseDate("2024-01-15"))).toBe(true)
  })

  test("returns false when any single component is NaN", () => {
    expect(isValidDate(new CalendarDate(NaN, 1, 15))).toBe(false)
    expect(isValidDate(new CalendarDate(2024, NaN, 15))).toBe(false)
    expect(isValidDate(new CalendarDate(2024, 1, NaN))).toBe(false)
    expect(isValidDate(new CalendarDate(NaN, NaN, NaN))).toBe(false)
  })
})

describe("view helpers", () => {
  test("clampView constrains the view between min and max", () => {
    expect(clampView("day", "month", "year")).toBe("month")
    expect(clampView("year", "day", "month")).toBe("month")
    expect(clampView("month", "day", "year")).toBe("month")
  })

  test("clampView falls back to the day floor and year ceiling when bounds are omitted", () => {
    expect(clampView(undefined, undefined, undefined)).toBe("day")
    expect(clampView("year", undefined, undefined)).toBe("year")
    expect(clampView("day", "month", undefined)).toBe("month")
    expect(clampView("year", undefined, "month")).toBe("month")
  })

  test("isAboveMinView / isBelowMinView compare view rank", () => {
    expect(isAboveMinView("year", "month")).toBe(true)
    expect(isAboveMinView("day", "day")).toBe(false)
    expect(isBelowMinView("day", "month")).toBe(true)
    expect(isBelowMinView("year", "day")).toBe(false)
  })

  test("getNextView advances one rank, clamped to the year ceiling", () => {
    expect(getNextView("day", "day", "year")).toBe("month")
    expect(getNextView("month", "day", "year")).toBe("year")
    expect(getNextView("year", "day", "year")).toBe("year")
  })

  test("getNextView respects a maxView below year", () => {
    expect(getNextView("day", "day", "month")).toBe("month")
    expect(getNextView("month", "day", "month")).toBe("month")
    expect(getNextView("day", "day", "day")).toBe("day")
  })

  test("getPreviousView steps back one rank, clamped to the day floor", () => {
    expect(getPreviousView("year", "day", "year")).toBe("month")
    expect(getPreviousView("month", "day", "year")).toBe("day")
    expect(getPreviousView("day", "day", "year")).toBe("day")
    expect(getPreviousView("month", "month", "year")).toBe("month")
  })

  test("eachView visits every view once, from day to year", () => {
    const visited: string[] = []
    eachView((view) => visited.push(view))
    expect(visited).toEqual(["day", "month", "year"])
  })
})

describe("getRoleDescription", () => {
  test("names the span each view covers", () => {
    expect(getRoleDescription("day")).toBe("calendar month")
    expect(getRoleDescription("month")).toBe("calendar year")
    expect(getRoleDescription("year")).toBe("calendar decade")
  })
})

describe("getInputPlaceholder", () => {
  test("mirrors the locale's field order and separators", () => {
    expect(getInputPlaceholder("en-US")).toBe("mm/dd/yyyy")
    expect(getInputPlaceholder("en-GB")).toBe("dd/mm/yyyy")
    expect(getInputPlaceholder("de-DE")).toBe("dd.mm.yyyy")
    expect(getInputPlaceholder("ja-JP")).toBe("yyyy/mm/dd")
  })
})

describe("getVisibleRangeText", () => {
  const startValue = parseDate("2026-06-01")
  const endValue = parseDate("2026-07-31")

  const visibleRangeText = (
    overrides: Partial<Parameters<typeof getVisibleRangeText>[0]> = {},
  ) =>
    getVisibleRangeText({
      endValue,
      locale: "en",
      startValue,
      timeZone: "UTC",
      view: "day",
      ...overrides,
    })

  test("day view formats both endpoints with a spelled-out month", () => {
    const range = visibleRangeText()

    expect(range.start).toBe("June 2026")
    expect(range.end).toBe("July 2026")
    expect(range.formatted).toBe("June 2026 - July 2026")
  })

  test("collapses the label when a single month is visible", () => {
    const range = visibleRangeText({endValue: parseDate("2026-06-30")})

    expect(range.start).toBe("June 2026")
    expect(range.end).toBe("June 2026")
    expect(range.formatted).toBe("June 2026")
  })

  test("month view formats the year only", () => {
    const result = visibleRangeText({view: "month"})
    expect(result.formatted).toBe("2026")
  })

  test("year view spans the whole decade containing the start year", () => {
    const result = visibleRangeText({view: "year"})

    expect(result.start).toBe("2020")
    expect(result.end).toBe("2029")
    expect(result.formatted).toBe("2020 - 2029")
  })
})
