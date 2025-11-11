// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {JSX} from "@qualcomm-ui/utils/machine"

import type {progressRingClasses} from "./progress-ring.classes"

export type QdsProgressRingSize =
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | number
export type QdsProgressRingEmphasis = "primary" | "neutral"

export interface QdsProgressRingApiProps {
  /**
   * Governs the color of the progress circle.
   *
   * @default 'primary'
   */
  emphasis?: QdsProgressRingEmphasis

  /**
   * Governs the height of the progress circle and track.
   *
   * @default 'md'
   */
  size?: QdsProgressRingSize

  /**
   * The thickness of the progress ring in pixels. If supplied as a number, it
   * will be used as the pixel value.
   *
   * The default value varies based on the {@link size} of the progress circle.
   */
  thickness?: string | number | undefined
}

type ProgressClasses = typeof progressRingClasses

export interface QdsProgressRingRootBindings {
  className: ProgressClasses["root"]
  "data-size": QdsProgressRingSize
}

export interface QdsProgressRingLabelBindings {
  className: ProgressClasses["label"]
}

export interface QdsProgressRingTrackBindings {
  className: ProgressClasses["track"]
  "data-size": QdsProgressRingSize
}

export interface QdsProgressRingBarBindings {
  className: ProgressClasses["bar"]
  "data-emphasis": QdsProgressRingEmphasis
  "data-size": QdsProgressRingSize
}

export interface QdsProgressRingCircleBindings {
  className: ProgressClasses["circle"]
  "data-emphasis": QdsProgressRingEmphasis
  "data-size": QdsProgressRingSize
  style: JSX.CSSProperties
  xmlns: string
}

export interface QdsProgressRingValueTextBindings {
  className: ProgressClasses["valueText"]
  hidden: boolean
}

export interface QdsProgressRingErrorTextBindings {
  className: ProgressClasses["errorText"]
}

export interface QdsProgressRingCircleContainerBindings {
  className: ProgressClasses["circleContainer"]
  "data-part": "circle-container"
  "data-scope": "progress"
}

export interface QdsProgressRingApi {
  size: QdsProgressRingSize

  // group: bindings
  getBarBindings(): QdsProgressRingBarBindings
  getCircleBindings(): QdsProgressRingCircleBindings
  getCircleContainerBindings(): QdsProgressRingCircleContainerBindings
  getErrorTextBindings(): QdsProgressRingErrorTextBindings
  getLabelBindings(): QdsProgressRingLabelBindings
  getRootBindings(): QdsProgressRingRootBindings
  getTrackBindings(): QdsProgressRingTrackBindings
  getValueTextBindings(): QdsProgressRingValueTextBindings
}
