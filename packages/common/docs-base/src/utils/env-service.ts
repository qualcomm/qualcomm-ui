// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export class EnvService {
  static getOrThrow(key: string): string {
    const variable = process.env[key]
    if (!variable) {
      throw new Error(`Expected environment variable to be defined: ${key}`)
    }
    return variable
  }
}
