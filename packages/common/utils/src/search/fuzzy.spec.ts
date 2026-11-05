import {describe, expect, test} from "vitest"

import {levenshteinDistance} from "./fuzzy"

describe("levenshteinDistance", () => {
  test("returns zero for equal strings", () => {
    expect(levenshteinDistance("kitten", "kitten")).toBe(0)
  })

  test("counts insertion, deletion, and substitution edits", () => {
    expect(levenshteinDistance("kitten", "sitting")).toBe(3)
    expect(levenshteinDistance("", "abc")).toBe(3)
    expect(levenshteinDistance("abc", "")).toBe(3)
  })
})
