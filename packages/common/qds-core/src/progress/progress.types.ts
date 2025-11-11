// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {progressClasses} from "./progress.classes"

export type QdsProgressSize = "sm" | "md" | "lg"
export type QdsProgressEmphasis = "primary" | "neutral"
export type QdsProgressLabelOrientation = "top" | "side"

export interface QdsProgressApiProps {
  /**
   * Governs the color of the progress bar.
   *
   * @default 'primary'
   */
  emphasis?: QdsProgressEmphasis

  /**
   * Governs the placement of the label and value text relative to
   * the progress bar.
   *
   * @option `top`: the label and value text are positioned above the progress bar.
   * @option `side`: the label and value text are positioned on the same horizontal axis as the progress bar, to the left and right, respectively.
   *
   * @default 'top'
   */
  labelOrientation?: QdsProgressLabelOrientation

  /**
   * Governs the height of the progress bar and track.
   *
   * @default 'md'
   */
  size?: QdsProgressSize
}

type ProgressClasses = typeof progressClasses

export interface QdsProgressRootBindings {
  className: ProgressClasses["root"]
  "data-label-orientation": QdsProgressLabelOrientation
  "data-size": QdsProgressSize
}

export interface QdsProgressLabelBindings {
  className: ProgressClasses["label"]
}

export interface QdsProgressTrackBindings {
  className: ProgressClasses["track"]
  "data-size": QdsProgressSize
}

export interface QdsProgressBarBindings {
  className: ProgressClasses["bar"]
  "data-emphasis": QdsProgressEmphasis
  "data-size": QdsProgressSize
}

export interface QdsProgressValueTextBindings {
  className: ProgressClasses["valueText"]
}

export interface QdsProgressErrorTextBindings {
  className: ProgressClasses["errorText"]
}

export interface QdsProgressHintBindings {
  className: ProgressClasses["hint"]
}

export interface QdsProgressApi {
  size: QdsProgressSize

  // group: bindings
  getBarBindings(): QdsProgressBarBindings
  getErrorTextBindings(): QdsProgressErrorTextBindings
  getHintBindings(): QdsProgressHintBindings
  getLabelBindings(): QdsProgressLabelBindings
  getRootBindings(): QdsProgressRootBindings
  getTrackBindings(): QdsProgressTrackBindings
  getValueTextBindings(): QdsProgressValueTextBindings
}
