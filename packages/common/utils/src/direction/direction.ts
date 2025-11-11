// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export type Direction = "ltr" | "rtl"

export interface DirectionProperty {
  /**
   * The document's text/writing direction.
   *
   * @default 'ltr'
   */
  dir?: Direction | undefined
}

export interface LocaleProperty {
  /**
   * The current locale. Based on the BCP 47 definition.
   *
   * @default 'en-US'
   */
  locale?: string | undefined
}

export interface Locale {
  /**
   * The document's text/writing direction.
   */
  dir: Direction

  /**
   * The current locale. Based on the BCP 47 definition.
   */
  locale: string
}
