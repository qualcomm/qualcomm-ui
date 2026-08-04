// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {CanGoToStepDetails} from "../stepper.types.js"

export interface StepNavigationParams {
  canGoToStep?:
    | ((details: CanGoToStepDetails) => boolean | undefined)
    | undefined
  current: number
  isStepSkippable?: ((index: number) => boolean) | undefined
  linear: boolean
  targetStep: number
  visited?: Record<number, boolean> | undefined
}

export function isValidStepNavigation(params: StepNavigationParams): boolean {
  const {canGoToStep, current, isStepSkippable, linear, targetStep, visited} =
    params

  const targetVisited = visited?.[targetStep] ?? false
  const details: CanGoToStepDetails = {
    current,
    target: targetStep,
    visited: targetVisited,
  }

  // Skippable steps bypass validation
  if (isStepSkippable?.(current)) {
    return true
  }

  // Non-linear stepper defers to canGoToStep if provided
  if (!linear) {
    return canGoToStep?.(details) ?? true
  }

  // Always allow backward navigation
  if (targetStep <= current) {
    return true
  }

  // Custom validator receives full context when provided.
  // Returning undefined defers to the built-in navigation rules below.
  if (canGoToStep) {
    const result = canGoToStep(details)
    if (result !== undefined) {
      return result
    }
  }

  // Visited steps bypass the default linear restriction
  if (targetVisited) {
    return true
  }

  // Linear mode: only allow the next step
  return targetStep === current + 1
}
