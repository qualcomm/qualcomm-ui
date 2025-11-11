// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export function escapeRegex(term: string): string {
  return term.replace(/[|\\{}()[\]^$+*?.-]/g, (char: string) => `\\${char}`)
}
