import {describe, expect, test} from "vitest"

import {highlightWord} from "./highlight"
import {highlightFirst} from "./highlight-first"

describe("highlightWord", () => {
  test("highlights the first case-insensitive match by default", () => {
    expect(
      highlightWord({
        ignoreCase: true,
        query: "alpha",
        text: "Alpha beta alpha",
      }),
    ).toEqual([
      {match: true, text: "Alpha"},
      {match: false, text: " beta alpha"},
    ])
  })

  test("highlights all query matches when matchAll is true", () => {
    expect(
      highlightWord({
        matchAll: true,
        query: ["alpha", "beta"],
        text: "alpha gamma beta",
      }),
    ).toEqual([
      {match: true, text: "alpha"},
      {match: false, text: " gamma "},
      {match: true, text: "beta"},
    ])
  })

  test("honors exact word matching", () => {
    expect(
      highlightWord({
        exactMatch: true,
        matchAll: true,
        query: "cat",
        text: "cat scatter cat",
      }),
    ).toEqual([
      {match: true, text: "cat"},
      {match: false, text: " scatter "},
      {match: true, text: "cat"},
    ])
  })

  test("escapes regular expression characters in queries", () => {
    expect(
      highlightWord({matchAll: true, query: "a+b", text: "a+b aab"}),
    ).toEqual([
      {match: true, text: "a+b"},
      {match: false, text: " aab"},
    ])
  })

  test("requires matchAll when query is an array", () => {
    expect(() =>
      highlightWord({matchAll: false, query: ["a", "b"], text: "abc"}),
    ).toThrow("matchAll must be true when using multiple queries")
  })
})

describe("highlightFirst", () => {
  test("splits text around the first exact word match", () => {
    expect(
      highlightFirst({
        exactMatch: true,
        query: "cat",
        text: "a cat scatters",
      }),
    ).toEqual([
      {match: false, text: "a "},
      {match: true, text: "cat"},
      {match: false, text: " scatters"},
    ])
  })

  test("honors ignoreCase for exact word matching", () => {
    expect(
      highlightFirst({
        exactMatch: true,
        ignoreCase: true,
        query: "cat",
        text: "A CAT scatters",
      }),
    ).toEqual([
      {match: false, text: "A "},
      {match: true, text: "CAT"},
      {match: false, text: " scatters"},
    ])
  })

  test("returns one non-matching chunk when exact matching finds no word", () => {
    expect(
      highlightFirst({
        exactMatch: true,
        query: "cat",
        text: "scatter",
      }),
    ).toEqual([{match: false, text: "scatter"}])
  })

  test("returns one non-matching chunk when case-sensitive search misses", () => {
    expect(
      highlightFirst({
        ignoreCase: false,
        query: "alpha",
        text: "Alpha beta",
      }),
    ).toEqual([{match: false, text: "Alpha beta"}])
  })

  test("splits text around the first non-exact match", () => {
    expect(
      highlightFirst({
        query: "beta",
        text: "alpha beta gamma",
      }),
    ).toEqual([
      {match: false, text: "alpha "},
      {match: true, text: "beta"},
      {match: false, text: " gamma"},
    ])
  })
})
