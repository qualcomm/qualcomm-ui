// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export function isCaretAtStart(
  input: HTMLInputElement | HTMLTextAreaElement | null,
): boolean {
  if (!input) {
    return false
  }
  try {
    return input.selectionStart === 0 && input.selectionEnd === 0
  } catch {
    return input.value === ""
  }
}

export function setCaretToEnd(
  input: HTMLInputElement | HTMLTextAreaElement | null,
): void {
  if (!input) {
    return
  }
  const start = input.selectionStart ?? 0
  const end = input.selectionEnd ?? 0
  if (Math.abs(end - start) !== 0) {
    return
  }
  if (start !== 0) {
    return
  }
  input.setSelectionRange(input.value.length, input.value.length)
}
