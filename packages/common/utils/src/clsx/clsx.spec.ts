import {describe, expect, test} from "vitest"

import {clsx} from "./clsx"

describe("clsx", () => {
  test("keeps object keys with truthy values", () => {
    expect(clsx({a: true, b: false, c: 0, d: null, e: undefined, f: 1})).eq(
      "a f",
    )
  })

  test("joins arrays of class names and ignore falsy values", () => {
    expect(clsx("a", 0, null, undefined, true, 1, "b")).eq("a 1 b")
  })

  test("supports heterogeneous arguments", () => {
    expect(clsx({a: true}, "b", 0)).eq("a b")
  })

  test("should be trimmed", () => {
    expect(clsx("", "b", {}, "")).eq("b")
  })

  test("returns an empty string for an empty configuration", () => {
    expect(clsx({})).eq("")
  })

  test("supports an array of class names", () => {
    expect(clsx(["a", "b"])).eq("a b")
  })

  test("joins array arguments with string arguments", () => {
    expect(clsx(["a", "b"], "c")).eq("a b c")
    expect(clsx("c", ["a", "b"])).eq("c a b")
  })

  test("handles multiple array arguments", () => {
    expect(clsx(["a", "b"], ["c", "d"])).eq("a b c d")
  })

  test("handles arrays that include falsy and true values", () => {
    expect(clsx(["a", 0, null, undefined, false, true, "b"])).eq("a b")
  })

  test("handles arrays that include arrays", () => {
    expect(clsx(["a", ["b", "c"]])).eq("a b c")
  })

  test("handles arrays that include objects", () => {
    expect(clsx(["a", {b: true, c: false}])).eq("a b")
  })

  test("handles deep array recursion", () => {
    expect(clsx(["a", ["b", ["c", {d: true}]]])).eq("a b c d")
  })

  test("handles arrays that are empty", () => {
    expect(clsx("a", [])).eq("a")
  })

  test("handles nested arrays that have empty nested arrays", () => {
    expect(clsx("a", [[]])).eq("a")
  })

  test("handles all types of truthy and falsy property values as expected", () => {
    const out = clsx({
      emptyList: [],
      emptyObject: {},
      emptyString: "",
      false: false,
      function: Object.prototype.toString,
      greaterZero: 1,
      negativeZero: -0,
      nonEmptyList: [1, 2, 3],
      nonEmptyObject: {a: 1, b: 2},
      nonEmptyString: "foobar",
      noNumber: NaN,
      null: null,
      undefined,
      whitespace: " ",
      zero: 0,
    })

    expect(out).eq(
      "emptyList emptyObject function greaterZero nonEmptyList nonEmptyObject nonEmptyString whitespace",
    )
  })
})
