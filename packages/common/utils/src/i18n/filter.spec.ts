import {describe, expect, test} from "vitest"

import {createFilter, i18nCache} from "./index"

describe("i18nCache", () => {
  test("returns the same formatter for equivalent locale and options", () => {
    const cache = i18nCache(Intl.Collator)

    expect(cache("en-US", {sensitivity: "base", usage: "search"})).toBe(
      cache("en-US", {sensitivity: "base", usage: "search"}),
    )
  })
})

describe("createFilter", () => {
  test("matches startsWith, endsWith, and contains with base sensitivity", () => {
    const filter = createFilter({sensitivity: "base"})

    expect(filter.startsWith("Résumé", "resume")).toBe(true)
    expect(filter.endsWith("hello world", "WORLD")).toBe(true)
    expect(filter.contains("one two three", "TWO")).toBe(true)
  })

  test("ignores punctuation when requested", () => {
    const filter = createFilter({ignorePunctuation: true})

    expect(filter.contains("foo-bar", "foobar")).toBe(true)
  })

  test("matches fuzzy substrings within the configured edit threshold", () => {
    const filter = createFilter({fuzzyThreshold: 1})

    expect(filter.fuzzyContains("hello world", "wurld")).toBe(true)
    expect(filter.fuzzyContains("hello world", "zzzz")).toBe(false)
  })

  test("matches locale-aware exact substrings before fuzzy matching", () => {
    const filter = createFilter({sensitivity: "base"})

    expect(filter.fuzzyContains("hello WORLD", "world")).toBe(true)
    expect(filter.fuzzyContains("Résumé", "resume")).toBe(true)
  })

  test("treats empty substrings as matches", () => {
    const filter = createFilter()

    expect(filter.startsWith("abc", "")).toBe(true)
    expect(filter.endsWith("abc", "")).toBe(true)
    expect(filter.contains("abc", "")).toBe(true)
    expect(filter.fuzzyContains("abc", "")).toBe(true)
  })
})
