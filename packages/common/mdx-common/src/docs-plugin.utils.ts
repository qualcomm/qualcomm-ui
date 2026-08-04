// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {NavBadge} from "./docs-plugin.types.js"

/**
 * @since 2.2.0
 */
export function isNavBadge(obj: unknown): obj is NavBadge {
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
