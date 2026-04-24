// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {
  BadgeClasses,
  QdsBadgeBasicSize,
  QdsBadgeCategoryEmphasis,
  QdsBadgeSemanticEmphasis,
  QdsBaseBadgeProps,
} from "./badge.types"
import type {textBadgeAnatomy} from "./text-badge.anatomy"

export type QdsTextBadgeVariant = "default" | "subtle"

export interface QdsTextBadgeProps extends QdsBaseBadgeProps {
  /**
   * Governs the color of the text badge.
   * @default 'neutral'
   */
  emphasis?: QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  size?: QdsBadgeBasicSize

  /**
   * Governs the style of the text badge.
   * @default 'default'
   */
  variant?: QdsTextBadgeVariant
}

type PartName = AnatomyPartName<typeof textBadgeAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"textBadge", P> {}

export interface QdsTextBadgeRootBindings extends Part<"root"> {
  className: BadgeClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis
  "data-size": QdsBadgeBasicSize
  "data-variant": QdsTextBadgeVariant
}

export interface QdsTextBadgeApi {
  getRootBindings(): QdsTextBadgeRootBindings
}
