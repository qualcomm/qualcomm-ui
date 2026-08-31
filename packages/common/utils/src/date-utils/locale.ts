// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export const isValidCharacter = (
  char: string | null,
  separator: string,
): boolean => {
  if (!char) {
    return true
  }
  return /\d/.test(char) || separator.includes(char) || char.length !== 1
}

export const ensureValidCharacters = (
  value: string,
  separator: string,
): string => {
  return value
    .split("")
    .filter((char) => isValidCharacter(char, separator))
    .join("")
}

const separatorCache = new Map<string, string>()

export function getLocaleSeparator(locale: string): string {
  let separator = separatorCache.get(locale)
  if (separator != null) {
    return separator
  }
  const parts = new Intl.DateTimeFormat(locale).formatToParts(new Date())
  const literal = parts.find((part) => part.type === "literal")
  separator = literal ? literal.value : "/"
  separatorCache.set(locale, separator)
  return separator
}
