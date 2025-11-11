// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export type QdsDividerOrientation = "horizontal" | "vertical"

export type QdsDividerVariant = "subtle" | "normal" | "strong"

export interface QdsDividerApiProps {
  /**
   * Controls whether the divider renders horizontally or vertically.
   *
   * @default 'horizontal'
   */
  orientation?: QdsDividerOrientation

  /**
   * Visual emphasis level of the divider.
   * @option `subtle`: Low contrast, less visually prominent
   * @option `normal`: Standard appearance with balanced visibility
   * @option `strong`: High contrast, maximum visual separation
   *
   * @default 'normal'
   */
  variant?: QdsDividerVariant
}

export interface QdsDividerRootBindings {
  "data-variant": QdsDividerVariant
  role: "separator"
}

export interface QdsDividerApi {
  getRootBindings(): QdsDividerRootBindings
}
