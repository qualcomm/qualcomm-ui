// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {iconClasses} from "./icon.classes"

export type QdsIconSize = "xs" | "sm" | "md" | "lg" | "xl" | string | number

export interface QdsIconApiProps {
  height?: string | number | undefined
  size?: QdsIconSize | undefined
  viewBox?: string
  width?: string | number | undefined
  xmlns?: string
}

export interface QdsIconBindings {
  className: (typeof iconClasses)["root"]
  "data-size": string | number
  fill: "none"
  stroke: string
  strokeLinecap: string
  strokeLinejoin: string
  viewBox: string
  xmlns: string
}
