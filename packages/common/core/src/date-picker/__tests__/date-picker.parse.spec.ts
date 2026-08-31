import {CalendarDate, parseDate} from "@internationalized/date"
import {describe, expect, test} from "vitest"

import {parse} from "../date-picker.parse.js"

describe("parse", () => {
  test("converts a native Date, shifting 0-indexed months to 1-indexed", () => {
    expect(parse(new Date(2024, 0, 15))).toEqual(new CalendarDate(2024, 1, 15))
    expect(parse(new Date(2024, 11, 31))).toEqual(
      new CalendarDate(2024, 12, 31),
    )
  })

  test("reads a native Date's local wall-clock fields, dropping the time", () => {
    expect(parse(new Date(2024, 1, 20, 0, 0, 0))).toEqual(
      new CalendarDate(2024, 2, 20),
    )
    expect(parse(new Date(2024, 1, 20, 23, 59, 59))).toEqual(
      new CalendarDate(2024, 2, 20),
    )
  })

  test("maps over an array, converting each entry", () => {
    expect(parse([new Date(2024, 0, 15), new Date(2024, 1, 20)])).toEqual([
      new CalendarDate(2024, 1, 15),
      new CalendarDate(2024, 2, 20),
    ])
  })

  test("maps over an array of mixed strings and Dates", () => {
    expect(parse(["2024-01-15", new Date(2024, 1, 20)])).toEqual([
      new CalendarDate(2024, 1, 15),
      new CalendarDate(2024, 2, 20),
    ])
  })

  test("returns an empty array for an empty array", () => {
    expect(parse([])).toEqual([])
  })

  test("delegates a plain ISO string to parseDate", () => {
    expect(parse("2024-01-15")).toEqual(parseDate("2024-01-15"))
  })

  test("keeps a leap day intact", () => {
    expect(parse("2024-02-29")).toEqual(new CalendarDate(2024, 2, 29))
    expect(parse(new Date(2024, 1, 29))).toEqual(new CalendarDate(2024, 2, 29))
  })

  test("throws on a malformed ISO string", () => {
    expect(() => parse("not-a-date")).toThrow()
  })
})
