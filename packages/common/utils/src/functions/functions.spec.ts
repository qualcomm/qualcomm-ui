import {describe, expect, test, vi} from "vitest"

import {
  callAll,
  cast,
  createChainedFunction,
  debounce,
  identity,
  match,
  noop,
  runIfFn,
  throttle,
  tryCatch,
} from "./functions"

describe("function helpers", () => {
  test("runIfFn invokes functions and returns non-null values directly", () => {
    expect(runIfFn((value: number) => value * 2, 4)).toBe(8)
    expect(runIfFn("value" as unknown as any)).toBe("value")
    expect(runIfFn(null as unknown as any)).toBeUndefined()
  })

  test("callAll invokes all provided callbacks with arguments", () => {
    const first = vi.fn()
    const second = vi.fn()

    callAll(first, undefined, second)("value")

    expect(first).toHaveBeenCalledWith("value")
    expect(second).toHaveBeenCalledWith("value")
  })

  test("match returns values, invokes handlers, and throws for missing keys", () => {
    expect(match("static", {dynamic: () => 2, static: 1} as any)).toBe(1)
    expect(
      match(
        "dynamic",
        {dynamic: (value: number) => value * 2, static: 1} as any,
        3,
      ),
    ).toBe(6)
    expect(() => match("missing", {static: 1} as any)).toThrow(
      'No matching key: "missing"',
    )
  })

  test("tryCatch returns fallback when the function throws", () => {
    expect(
      tryCatch(
        () => "ok",
        () => "fallback",
      ),
    ).toBe("ok")
    expect(
      tryCatch(
        () => {
          throw new Error("fail")
        },
        () => "fallback",
      ),
    ).toBe("fallback")
  })

  test("createChainedFunction calls functions with this value and id", () => {
    const context = {name: "ctx"}
    const first = vi.fn()
    const second = vi.fn()

    createChainedFunction([first, undefined, second], "field").call(
      context,
      "value",
    )

    expect(first).toHaveBeenCalledWith("value", "field")
    expect(second).toHaveBeenCalledWith("value", "field")
    expect(first.mock.contexts[0]).toBe(context)
    expect(second.mock.contexts[0]).toBe(context)
  })

  test("throttle runs immediately and schedules the next call", () => {
    vi.useFakeTimers()
    vi.setSystemTime(1000)
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled("first")
    vi.setSystemTime(1050)
    throttled("second")
    throttled("third")

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith("first")

    vi.advanceTimersByTime(50)

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith("second")
    vi.useRealTimers()
  })

  test("debounce delays calls and supports clearing", () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced("first")
    debounced("second")
    vi.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledWith("second")

    debounced("third")
    debounced.clear()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  test("identity, cast, and noop expose simple helper behavior", () => {
    const fn = vi.fn()

    identity(fn)
    noop()

    expect(fn).toHaveBeenCalledTimes(1)
    expect(cast<string>(123)).toBe(123)
  })
})
