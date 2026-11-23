import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"

import {resolveDateFilterPreset} from "./filters.presets"

beforeEach(() => {
  vi.useFakeTimers()
  // A Monday.
  vi.setSystemTime(new Date("2026-11-16T12:00:00.000Z"))
})

afterEach(() => {
  vi.useRealTimers()
})

describe("resolveDateFilterPreset", () => {
  test("built-in presets resolve to ISO dates relative to today", () => {
    expect(
      resolveDateFilterPreset(
        {label: "Last 7 days", value: "last7Days"},
        {timeZone: "UTC"},
      ),
    ).toEqual(["2026-11-10", "2026-11-16"])
    expect(
      resolveDateFilterPreset(
        {label: "Last month", value: "lastMonth"},
        {timeZone: "UTC"},
      ),
    ).toEqual(["2026-10-01", "2026-10-31"])
  })

  test("the locale decides where week presets start", () => {
    const thisWeek = {label: "This week", value: "thisWeek"} as const
    expect(
      resolveDateFilterPreset(thisWeek, {locale: "en-US", timeZone: "UTC"}),
    ).toEqual(["2026-11-15", "2026-11-21"])
    expect(
      resolveDateFilterPreset(thisWeek, {locale: "en-GB", timeZone: "UTC"}),
    ).toEqual(["2026-11-16", "2026-11-22"])
  })

  test("custom presets resolve with their own range", () => {
    const range = vi.fn((): [string, null] => ["2026-04-01", null])
    expect(
      resolveDateFilterPreset({label: "This fiscal year", range, value: "fy"}),
    ).toEqual(["2026-04-01", null])
    expect(range).toHaveBeenCalledOnce()
  })
})
