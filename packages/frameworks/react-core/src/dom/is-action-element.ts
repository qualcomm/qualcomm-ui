// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export function isActionElement(element: HTMLElement): boolean {
  return element.tagName === "BUTTON" || element.tagName === "A"
}
