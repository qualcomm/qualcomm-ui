// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Calls the provided factory function and returns its result without memoization.
 * Uses the `"use no memo"` directive to opt out of React's automatic memoization
 * (e.g., React Compiler).
 *
 * @param factory - A function that produces the value to return.
 * @returns The result of invoking the factory function.
 */
export function useNoMemo<const T>(factory: () => T): T {
  "use no memo"
  return factory()
}
