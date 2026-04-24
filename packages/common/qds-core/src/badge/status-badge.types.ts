// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {
  BadgeClasses,
  QdsBadgeExtraSize,
  QdsBadgeSemanticEmphasis,
  QdsBaseBadgeProps,
} from "./badge.types"
import type {statusBadgeAnatomy} from "./status-badge.anatomy"

export type QdsStatusBadgeVariant = "filled" | "outlined"

export interface QdsStatusBadgeProps extends QdsBaseBadgeProps {
  /**
   * Governs the color of the status badge.
   * @default 'neutral'
   */
  emphasis?: QdsBadgeSemanticEmphasis

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  size?: QdsBadgeExtraSize

  /**
   * Governs the style of the status badge.
   * @default 'filled'
   */
  variant?: QdsStatusBadgeVariant
}

type PartName = AnatomyPartName<typeof statusBadgeAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"statusBadge", P> {}

export interface QdsStatusBadgeRootBindings extends Part<"root"> {
  className: BadgeClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsBadgeSemanticEmphasis
  "data-size": QdsBadgeExtraSize
  "data-variant": QdsStatusBadgeVariant
}

export interface QdsStatusBadgeApi {
  getRootBindings(): QdsStatusBadgeRootBindings
}
