import {describe, expect, test} from "vitest"

import {coerceNumberProperty, coercePixelProperty} from "./coercion"

describe("coercePixelProperty", () => {
  test("adds px to numbers and unsigned integer strings", () => {
    expect(coercePixelProperty(12)).toBe("12px")
    expect(coercePixelProperty("12")).toBe("12px")
  })

  test("returns non-integer css values unchanged", () => {
    expect(coercePixelProperty("1.5rem")).toBe("1.5rem")
    expect(coercePixelProperty("100%")).toBe("100%")
  })
})

describe("coerceNumberProperty", () => {
  test("coerces numeric values and numeric strings", () => {
    expect(coerceNumberProperty(4)).toBe(4)
    expect(coerceNumberProperty("4.5")).toBe(4.5)
  })

  test("returns fallback for non-numeric values", () => {
    expect(coerceNumberProperty("123abc", 9)).toBe(9)
    expect(coerceNumberProperty(null, 9)).toBe(9)
  })
})
