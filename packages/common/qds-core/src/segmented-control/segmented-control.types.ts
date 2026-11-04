// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {segmentedControlClasses} from "./segmented-control.classes.js"

export type QdsSegmentedControlSize = "sm" | "md" | "lg"

export type QdsSegmentedControlLayout = "hug" | "fill"

/** @deprecated use "brand" */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type QdsSegmentedControlEmphasis__deprecated = "primary"

export type QdsSegmentedControlEmphasis =
  | "brand"
  | "neutral"
  | QdsSegmentedControlEmphasis__deprecated

/**
 * @deprecated use {@link QdsSegmentedControlEmphasis} instead
 */
export type QdsSegmentedControlVariant = QdsSegmentedControlEmphasis

type SegmentedControlClasses = typeof segmentedControlClasses

export interface QdsSegmentedControlApiProps {
  /**
   * Governs the color of the segmented control.
   *
   * @default 'brand'
   * @since next-release
   */
  emphasis?: QdsSegmentedControlEmphasis

  /**
   * The layout used to display the segmented control.
   * - `hug`: Content-sized; width matches the items only (default).
   * - `fill`: Full width; items share space evenly.
   *
   * @default 'hug'
   */
  layout?: QdsSegmentedControlLayout

  /**
   * The size of the segmented control.
   *
   * @default 'md'
   */
  size?: QdsSegmentedControlSize

  /**
   * @deprecated use {@link emphasis} instead
   */
  variant?: QdsSegmentedControlVariant
}

export interface QdsSegmentedControlGroupBindings {
  className: SegmentedControlClasses["group"]
  "data-emphasis": QdsSegmentedControlEmphasis
  "data-layout": QdsSegmentedControlLayout
  "data-size": QdsSegmentedControlSize
}

export interface QdsSegmentedControlItemBindings {
  className: SegmentedControlClasses["item"]
  "data-size": QdsSegmentedControlSize
}

export interface QdsSegmentedControlItemTextBindings {
  className: SegmentedControlClasses["itemText"]
}

export interface QdsSegmentedControlItemHiddenInputBindings {
  className: SegmentedControlClasses["itemHiddenInput"]
}

export interface QdsSegmentedControlApi {
  emphasis: QdsSegmentedControlEmphasis
  layout: QdsSegmentedControlLayout
  size: QdsSegmentedControlSize
  /**
   * @deprecated use {@link emphasis} instead
   */
  variant: QdsSegmentedControlVariant

  // group: bindings
  getGroupBindings(): QdsSegmentedControlGroupBindings
  getItemBindings(): QdsSegmentedControlItemBindings
  getItemHiddenInputBindings(): QdsSegmentedControlItemHiddenInputBindings
  getItemTextBindings(): QdsSegmentedControlItemTextBindings
}
