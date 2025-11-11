// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export type LazyMode = "unmount" | "keepMounted" | "off"

export interface LazyOptions {
  isSelected?: boolean
  mode?: LazyMode
  wasSelected?: boolean
}

/**
 * Determines whether the children of a disclosure widget
 * should be rendered or not, depending on the lazy behavior.
 *
 * Used in accordion, tabs, popover, menu and other disclosure
 * widgets.
 */
export function lazyDisclosure(options: LazyOptions): boolean {
  const {isSelected, mode = "off", wasSelected} = options

  // if not lazy, always render the disclosure's content
  if (mode === "off") {
    return true
  }

  // if the disclosure is selected, render the disclosure's content
  if (isSelected) {
    return true
  }

  // if the disclosure was selected but not active, keep its content active
  if (mode === "keepMounted" && wasSelected) {
    return true
  }

  return false
}
