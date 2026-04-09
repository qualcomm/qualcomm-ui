// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export const QdsBrand = {
  ARDUINO: "arduino",
  DRAGONWING: "dragonwing",
  QUALCOMM: "qualcomm",
  SNAPDRAGON: "snapdragon",
} as const

export type QdsBrand = (typeof QdsBrand)[keyof typeof QdsBrand]

export const QdsTheme = {
  DARK: "dark",
  LIGHT: "light",
} as const

export type QdsTheme = (typeof QdsTheme)[keyof typeof QdsTheme]
