import {afterEach, describe, expect, test} from "vitest"

import {
  defined,
  ensure,
  ensureProps,
  hasProp,
  isArray,
  isBoolean,
  isDefined,
  isDev,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isObjectLike,
  isPlainObject,
  isString,
} from "./guard"

const originalNodeEnv = process.env.NODE_ENV

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv
})

describe("environment guards", () => {
  test("detects non-production environments", () => {
    process.env.NODE_ENV = "test"
    expect(isDev()).toBe(true)

    process.env.NODE_ENV = "production"
    expect(isDev()).toBe(false)
  })
})

describe("type guards", () => {
  test("detects primitive and callable values", () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
    expect(isBoolean(0)).toBe(false)

    expect(isNumber(1)).toBe(true)
    expect(isNumber(Number.NaN)).toBe(false)

    expect(isString("value")).toBe(true)
    expect(isString(1)).toBe(false)

    expect(isFunction(() => {})).toBe(true)
    expect(isFunction({})).toBe(false)
  })

  test("detects arrays, object-like values, and non-array objects", () => {
    expect(isArray([])).toBe(true)
    expect(isArray({length: 0})).toBe(false)

    expect(isObjectLike({})).toBe(true)
    expect(isObjectLike([])).toBe(true)
    expect(isObjectLike(null)).toBe(false)

    expect(isObject({})).toBe(true)
    expect(isObject(new Date())).toBe(true)
    expect(isObject([])).toBe(false)
    expect(isObject(null)).toBe(false)
  })

  test("detects nullish and defined values", () => {
    expect(isNull(null)).toBe(true)
    expect(isNull(undefined)).toBe(true)
    expect(isNull(false)).toBe(false)

    expect(isDefined(0)).toBe(true)
    expect(isDefined(false)).toBe(true)
    expect(isDefined(null)).toBe(false)

    expect(defined("value")).toBe(true)
    expect(defined(undefined)).toBe(false)
  })
})

describe("object guards", () => {
  test("detects own properties", () => {
    const inherited = {inherited: true}
    const value = Object.create(inherited) as {inherited: boolean; own: boolean}
    value.own = true

    expect(hasProp(value, "own")).toBe(true)
    expect(hasProp(value, "inherited")).toBe(false)
  })

  test("detects plain objects", () => {
    class Example {}

    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject(Object.create(null))).toBe(true)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject(new Date())).toBe(false)
    expect(isPlainObject(new Example())).toBe(false)
  })
})

describe("assertion helpers", () => {
  test("ensure throws for nullish values with string or lazy messages", () => {
    expect(() => ensure("value", "required")).not.toThrow()
    expect(() => ensure(null, "required")).toThrow("required")
    expect(() => ensure(undefined, () => "lazy required")).toThrow(
      "lazy required",
    )
  })

  test("ensureProps throws when required props are nullish", () => {
    expect(() =>
      ensureProps({count: 0, label: ""}, ["count", "label"]),
    ).not.toThrow()
    expect(() =>
      ensureProps({count: null, label: undefined}, ["count", "label"], "Field"),
    ).toThrow("[ > Field] missing required props: count, label")
    expect(() => ensureProps({count: null}, ["count"])).toThrow(
      "[] missing required props: count",
    )
  })
})
