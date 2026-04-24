// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {
  BadgeClasses,
  QdsBadgeBasicSize,
  QdsBaseBadgeProps,
} from "./badge.types"
import type {numberBadgeAnatomy} from "./number-badge.anatomy"

export type QdsNumberBadgeEmphasis =
  | "neutral"
  | "neutral-outline"
  | "brand"
  | "brand-outline"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "persistent-black"
  | "persistent-white"

export interface QdsNumberBadgeProps extends QdsBaseBadgeProps {
  /**
   * Governs the color and style of the number badge.
   * @default 'neutral'
   */
  emphasis?: QdsNumberBadgeEmphasis

  /**
   * Maximum value to display.
   * @default 99
   */
  max?: number

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  size?: QdsBadgeBasicSize

  /**
   * The numeric value to display.
   */
  value?: number
}

type PartName = AnatomyPartName<typeof numberBadgeAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"numberBadge", P> {}

export interface QdsNumberBadgeRootBindings extends Part<"root"> {
  className: BadgeClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsNumberBadgeEmphasis
  "data-overflow": BooleanDataAttr
  "data-size": QdsBadgeBasicSize
}

export interface QdsNumberBadgeApi {
  displayValue: number | string | null
  getRootBindings(): QdsNumberBadgeRootBindings
}
