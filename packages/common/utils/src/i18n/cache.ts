// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

type FormatOptions<T> = T extends Intl.NumberFormat
  ? Intl.NumberFormatOptions
  : T extends Intl.DateTimeFormat
    ? Intl.DateTimeFormatOptions
    : T extends Intl.RelativeTimeFormat
      ? Intl.RelativeTimeFormatOptions
      : T extends Intl.ListFormat
        ? Intl.ListFormatOptions
        : T extends Intl.PluralRules
          ? Intl.PluralRulesOptions
          : T extends Intl.Collator
            ? Intl.CollatorOptions
            : never

export function i18nCache<T extends abstract new (...args: any) => any>(
  Ins: T,
) {
  const formatterCache = new Map<string, T>()

  return function create(
    locale: string,
    options?: FormatOptions<InstanceType<T>>,
  ): InstanceType<T> {
    const cacheKey =
      locale +
      (options
        ? Object.entries(options)
            .sort((a, b) => (a[0] < b[0] ? -1 : 1))
            .join()
        : "")

    if (formatterCache.has(cacheKey)) {
      return formatterCache.get(cacheKey) as any
    }

    // @ts-ignore
    const formatter = new Ins(locale, options)
    formatterCache.set(cacheKey, formatter)

    return formatter as any
  }
}
