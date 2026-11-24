// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

const identifierName = /^[$A-Z_a-z][$\w]*$/

export function formatObjectPropertyName(name: string): string {
  return identifierName.test(name) ? name : JSON.stringify(name)
}
