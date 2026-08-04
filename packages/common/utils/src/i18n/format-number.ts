// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {i18nCache} from "./cache.js"

const getNumberFormatter = i18nCache(Intl.NumberFormat)

export function formatNumber(
  v: number,
  locale: string,
  options: Intl.NumberFormatOptions = {},
): string {
  const formatter = getNumberFormatter(locale, options)
  return formatter.format(v)
}
