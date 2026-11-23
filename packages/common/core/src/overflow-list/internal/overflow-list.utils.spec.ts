import {describe, expect, test} from "vitest"

import {type OverflowFitInput, getOverflowFit} from "./overflow-list.utils.js"

function fit(input: Partial<OverflowFitInput>) {
  return getOverflowFit({
    availableWidth: 100,
    gap: 10,
    indicatorWidth: 20,
    itemWidths: [],
    maxRows: 1,
    reservedWidth: 0,
    ...input,
  })
}

describe("getOverflowFit", () => {
  test("nothing overflows while every item fits", () => {
    expect(fit({itemWidths: [30, 30, 20]})).toEqual({
      overflowing: false,
      visibleCount: 3,
    })
  })

  test("nothing overflows without items", () => {
    expect(fit({itemWidths: []})).toEqual({
      overflowing: false,
      visibleCount: 0,
    })
  })

  test("drops trailing items until the indicator fits after the last visible item", () => {
    expect(fit({itemWidths: [30, 30, 30, 30]})).toEqual({
      overflowing: true,
      visibleCount: 2,
    })
  })

  test("keeps items in order instead of filling the row with later, narrower items", () => {
    expect(fit({itemWidths: [30, 60, 10]})).toEqual({
      overflowing: true,
      visibleCount: 1,
    })
  })

  test("wraps items onto additional rows up to maxRows", () => {
    expect(fit({itemWidths: [45, 45, 45, 45], maxRows: 2})).toEqual({
      overflowing: false,
      visibleCount: 4,
    })
    expect(fit({itemWidths: [45, 45, 45, 45, 45], maxRows: 2})).toEqual({
      overflowing: true,
      visibleCount: 3,
    })
  })

  test("keeps the reserved width free whether or not the items overflow", () => {
    expect(fit({itemWidths: [30, 30], reservedWidth: 20})).toEqual({
      overflowing: false,
      visibleCount: 2,
    })
    expect(fit({itemWidths: [30, 30], reservedWidth: 40})).toEqual({
      overflowing: true,
      visibleCount: 0,
    })
  })

  test("caps an item wider than the row at the row width", () => {
    expect(fit({indicatorWidth: 0, itemWidths: [150]})).toEqual({
      overflowing: false,
      visibleCount: 1,
    })
  })

  test("shows only the indicator when no item fits beside it", () => {
    expect(fit({itemWidths: [90, 90]})).toEqual({
      overflowing: true,
      visibleCount: 0,
    })
  })

  test("rounds item widths up and the row width down", () => {
    expect(
      fit({availableWidth: 60.9, indicatorWidth: 0, itemWidths: [25.2, 25]}),
    ).toEqual({overflowing: true, visibleCount: 1})
  })
})
