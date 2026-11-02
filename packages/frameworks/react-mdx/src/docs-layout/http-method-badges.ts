// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BadgeProps} from "@qualcomm-ui/react/badge"

/**
 * Badge colors of HTTP methods, shared by the side nav and OpenAPI pages.
 */
export const httpMethodBadges: Record<string, BadgeProps> = {
  delete: {emphasis: "red"},
  get: {emphasis: "green"},
  patch: {emphasis: "orange"},
  post: {emphasis: "blue"},
  put: {emphasis: "yellow"},
}
