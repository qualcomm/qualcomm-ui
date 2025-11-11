// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {segmentedControlClasses} from "./segmented-control.classes"

export type QdsSegmentedControlSize = "sm" | "md" | "lg"

export type QdsSegmentedControlLayout = "hug" | "fill"

export type QdsSegmentedControlVariant = "primary" | "neutral"

type SegmentedControlClasses = typeof segmentedControlClasses

export interface QdsSegmentedControlApiProps {
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
   * The variant of the segmented control.
   *
   * @default undefined
   */
  variant?: QdsSegmentedControlVariant
}

export interface QdsSegmentedControlGroupBindings {
  className: SegmentedControlClasses["group"]
  "data-layout": QdsSegmentedControlLayout
  "data-size": QdsSegmentedControlSize
  "data-variant": QdsSegmentedControlVariant
}

export interface QdsSegmentedControlItemBindings {
  className: SegmentedControlClasses["item"]
}

export interface QdsSegmentedControlItemTextBindings {
  className: SegmentedControlClasses["itemText"]
}

export interface QdsSegmentedControlItemHiddenInputBindings {
  className: SegmentedControlClasses["itemHiddenInput"]
}

export interface QdsSegmentedControlApi {
  layout: QdsSegmentedControlLayout
  size: QdsSegmentedControlSize
  variant: QdsSegmentedControlVariant

  // group: bindings
  getGroupBindings(): QdsSegmentedControlGroupBindings
  getItemBindings(): QdsSegmentedControlItemBindings
  getItemHiddenInputBindings(): QdsSegmentedControlItemHiddenInputBindings
  getItemTextBindings(): QdsSegmentedControlItemTextBindings
}
