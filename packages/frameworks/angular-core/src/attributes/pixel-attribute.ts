// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Coerces a string or number to a pixel value. Returns the value as-is if it
 * doesn't match a number-ish format.
 */
export function pixelAttribute(value: string | number): string {
  return typeof value === "number" || /^\d+$/.test(value) ? `${value}px` : value
}
