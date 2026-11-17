// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

const warned = new Set<string>()

/**
 * Logs a development-only warning once per key.
 */
export function warnOnce(key: string, message: string): void {
  if (process.env.NODE_ENV === "production" || warned.has(key)) {
    return
  }
  warned.add(key)
  console.warn(message)
}
