// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  QdsBadgeCategoryEmphasis,
  QdsBadgeSemanticEmphasis,
} from "@qualcomm-ui/qds-core/badge"

import type {FrontmatterBadge} from "../types"

export interface ResolvedFrontmatterBadge {
  emphasis: QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis
  href?: string
  id: string
  label: string
  pathname?: string
  title?: string
}

export function isFrontmatterBadge(obj: unknown): obj is FrontmatterBadge {
  return (
    typeof obj === "object" &&
    !!obj &&
    "label" in obj &&
    "id" in obj &&
    typeof obj.label === "string" &&
    (!("url" in obj) ||
      ("url" in obj && (typeof obj.url === "string" || !obj.url)))
  )
}

const knownBadges: Record<
  string,
  {
    emphasis: QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis
    title?: string
  }
> = {
  developerPreview: {
    emphasis: "purple",
    title: "Learn more about developer previews",
  },
  since: {
    emphasis: "brand",
  },
}

export function resolveFrontmatterBadges(
  frontmatter: Record<string, unknown>,
): ResolvedFrontmatterBadge[] {
  if (!("badges" in frontmatter)) {
    return []
  }
  const badges = frontmatter.badges
  if (typeof badges !== "object" || !badges) {
    return []
  }
  if (!Array.isArray(badges)) {
    return []
  }
  return badges
    .filter(isFrontmatterBadge)
    .map((badge): ResolvedFrontmatterBadge => {
      const knownBadge = knownBadges[badge.id]
      const resolvedBadge: ResolvedFrontmatterBadge = {
        emphasis: badge.emphasis || knownBadge?.emphasis || "neutral",
        id: badge.id,
        label: badge.label,
        title: badge.title || knownBadge?.title,
      }
      if (resolvedBadge.id === "since" && !resolvedBadge.title) {
        resolvedBadge.title = `This module was added in v${badge.label}`
      }
      if (badge.url) {
        if (badge.url.startsWith("/")) {
          resolvedBadge.pathname = badge.url
        } else if (badge.url.startsWith("http")) {
          resolvedBadge.href = badge.url
        }
      }
      return resolvedBadge
    })
}
