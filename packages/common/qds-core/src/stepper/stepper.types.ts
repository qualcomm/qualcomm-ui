// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {stepperClasses} from "./stepper.classes"

export type QdsStepperSize = "sm" | "lg"

export interface QdsStepperApiProps {
  /**
   * The size of the stepper and its elements.
   *
   * @default 'lg'
   */
  size?: QdsStepperSize
}

type StepperClasses = typeof stepperClasses

export interface QdsStepperRootBindings {
  className: StepperClasses["root"]
  "data-size": QdsStepperSize
}

export interface QdsStepperListBindings {
  className: StepperClasses["list"]
  "data-size": QdsStepperSize
}

export interface QdsStepperItemBindings {
  className: StepperClasses["item"]
  "data-size": QdsStepperSize
}

export interface QdsStepperTriggerBindings {
  className: StepperClasses["trigger"]
  "data-size": QdsStepperSize
}

export interface QdsStepperIndicatorBindings {
  className: StepperClasses["indicator"]
  "data-size": QdsStepperSize
}

export interface QdsStepperSeparatorBindings {
  className: StepperClasses["separator"]
  "data-size": QdsStepperSize
}

export interface QdsStepperCompletedContentBindings {
  className: StepperClasses["completedContent"]
  "data-size": QdsStepperSize
}

export interface QdsStepperContentBindings {
  className: StepperClasses["content"]
  "data-size": QdsStepperSize
}

export interface QdsStepperNextTriggerBindings {
  className: StepperClasses["nextTrigger"]
}

export interface QdsStepperPrevTriggerBindings {
  className: StepperClasses["prevTrigger"]
}

export interface QdsStepperLabelBindings {
  className: StepperClasses["label"]
  "data-size": QdsStepperSize
}

export interface QdsStepperHintBindings {
  className: StepperClasses["hint"]
  "data-size": QdsStepperSize
}

export interface QdsStepperIndicatorIconBindings {
  className: StepperClasses["indicatorIcon"]
  "data-size": QdsStepperSize
}

export interface QdsStepperApi {
  size: QdsStepperSize

  // group: bindings
  getCompletedContentBindings(): QdsStepperCompletedContentBindings
  getContentBindings(): QdsStepperContentBindings
  getHintBindings(): QdsStepperHintBindings
  getIndicatorBindings(): QdsStepperIndicatorBindings
  getIndicatorIconBindings(): QdsStepperIndicatorIconBindings
  getItemBindings(): QdsStepperItemBindings
  getLabelBindings(): QdsStepperLabelBindings
  getListBindings(): QdsStepperListBindings
  getNextTriggerBindings(): QdsStepperNextTriggerBindings
  getPrevTriggerBindings(): QdsStepperPrevTriggerBindings
  getRootBindings(): QdsStepperRootBindings
  getSeparatorBindings(): QdsStepperSeparatorBindings
  getTriggerBindings(): QdsStepperTriggerBindings
}
