// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {
  BadgeClasses,
  QdsBadgeCategoryEmphasis,
  QdsBadgeExtendedSize,
  QdsBadgeSemanticEmphasis,
  QdsBaseBadgeProps,
} from "./badge.types.js"
import type {iconBadgeAnatomy} from "./icon-badge.anatomy.js"

export type QdsIconBadgeVariant = "default" | "subtle"

export interface QdsIconBadgeProps extends QdsBaseBadgeProps {
  /**
   * Governs the color of the icon badge.
   * @default 'neutral'
   */
  emphasis?: QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  size?: QdsBadgeExtendedSize

  /**
   * Governs the style of the icon badge.
   * @default 'default'
   */
  variant?: QdsIconBadgeVariant
}

type PartName = AnatomyPartName<typeof iconBadgeAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"iconBadge", P> {}

export interface QdsIconBadgeRootBindings extends Part<"root"> {
  className: BadgeClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis
  "data-size": QdsBadgeExtendedSize
  "data-variant": QdsIconBadgeVariant
}

export interface QdsIconBadgeIconBindings extends Part<"icon"> {
  className: BadgeClasses["icon"]
  "data-size": QdsBadgeExtendedSize
}

export interface QdsIconBadgeApi {
  getIconBindings(): QdsIconBadgeIconBindings
  getRootBindings(): QdsIconBadgeRootBindings
  size: QdsBadgeExtendedSize
}
