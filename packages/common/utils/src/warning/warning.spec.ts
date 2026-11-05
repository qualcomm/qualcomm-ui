import {afterEach, describe, expect, test, vi} from "vitest"

import {invariant, warn} from "./warning"

const originalNodeEnv = process.env.NODE_ENV

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv
  vi.restoreAllMocks()
})

describe("warn", () => {
  test("logs warnings in non-production environments", () => {
    process.env.NODE_ENV = "test"
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {})

    warn("be careful")
    warn(true, "still careful")

    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenNthCalledWith(1, "be careful")
    expect(spy).toHaveBeenNthCalledWith(2, "still careful")
  })

  test("does not log when condition is false or production", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {})

    warn(false, "skip")
    process.env.NODE_ENV = "production"
    warn("skip production")

    expect(spy).not.toHaveBeenCalled()
  })
})

describe("invariant", () => {
  test("throws in non-production environments", () => {
    process.env.NODE_ENV = "test"

    expect(() => invariant("broken")).toThrow("broken")
    expect(() => invariant(true, "still broken")).toThrow("still broken")
  })

  test("does not throw when condition is false or production", () => {
    expect(() => invariant(false, "skip")).not.toThrow()

    process.env.NODE_ENV = "production"
    expect(() => invariant("skip production")).not.toThrow()
  })
})
