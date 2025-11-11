// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

function isArrayLike(value: any): boolean {
  return Array.isArray(value)
}

function isArrayEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (!isEqual(a[i], b[i])) {
      return false
    }
  }
  return true
}

export function isEqual(a: any, b: any): boolean {
  // Same reference (including both null, both undefined, or both NaN)
  if (Object.is(a, b)) {
    return true
  }

  // If either is null or undefined but not both (we already checked if both above)
  if (a == null || b == null) {
    return false
  }

  // Custom equality method
  if (typeof a.isEqual === "function" && typeof b.isEqual === "function") {
    return a.isEqual(b)
  }

  // Function comparison
  if (typeof a === "function" && typeof b === "function") {
    return Object.is(a, b)
  }

  // Date comparison
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  // RegExp comparison
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString()
  }

  // Array comparison
  if (isArrayLike(a) && isArrayLike(b)) {
    return isArrayEqual(a, b)
  }

  // If they're not both objects at this point, they can't be equal
  if (typeof a !== "object" || typeof b !== "object") {
    return false
  }

  // Get all enumerable keys
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  // Must have same number of keys
  if (keysA.length !== keysB.length) {
    return false
  }

  // Check if every key in A exists in B and has the same value
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false
    }

    if (!isEqual(a[key], b[key])) {
      return false
    }
  }

  return true
}
