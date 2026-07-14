// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Placement} from "@qualcomm-ui/dom/floating-ui"

import type {TourStepDetails, TourStepPlacement} from "../tour.types.js"

export function isTooltipStep(
  step: TourStepDetails | null,
): step is Omit<TourStepDetails, "placement"> & {placement: Placement} {
  return step?.type === "tooltip"
}

export function isDialogStep(step: TourStepDetails | null): boolean {
  return step?.type === "dialog"
}

export function isWaitStep(step: TourStepDetails | null): boolean {
  return step?.type === "wait"
}

export function getEffectiveSteps(steps: TourStepDetails[]): TourStepDetails[] {
  return steps.filter((step) => step.type !== "wait")
}

export function getProgress(steps: TourStepDetails[], stepIndex: number): number {
  return (stepIndex + 1) / getEffectiveSteps(steps).length
}

export function getEffectiveStepIndex(
  steps: TourStepDetails[],
  stepId: string | null | undefined,
): number {
  return findStepIndex(getEffectiveSteps(steps), stepId)
}

export function isTooltipPlacement(
  placement: TourStepPlacement | undefined,
): placement is Placement {
  return placement != null && placement !== "center"
}

function normalizeStep(step: TourStepDetails): TourStepDetails {
  if (step.type === "floating") {
    return {arrow: false, backdrop: false, placement: "bottom-end", ...step}
  }
  if (step.target == null || step.type === "dialog") {
    return {backdrop: true, placement: "center", type: "dialog", ...step}
  }
  if (!step.type || step.type === "tooltip") {
    return {arrow: true, backdrop: true, type: "tooltip", ...step}
  }
  return step
}

export function findStep(
  steps: TourStepDetails[],
  id: string | null | undefined,
): TourStepDetails | null {
  const result = id == null ? undefined : steps.find((step) => step.id === id)
  return result ? normalizeStep(result) : null
}

export function findStepIndex(
  steps: TourStepDetails[],
  id: string | null | undefined,
): number {
  return id == null ? -1 : steps.findIndex((step) => step.id === id)
}
