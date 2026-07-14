// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {
  TourApi as CoreTourApi,
  TourApiProps as CoreTourApiProps,
  TourStepDetails as CoreTourStepDetails,
  TourStepsChangeDetails as CoreTourStepsChangeDetails,
} from "@qualcomm-ui/core/tour"

export interface TourStepDetails extends Omit<
  CoreTourStepDetails,
  "description" | "heading"
> {
  description: ReactNode
  heading: ReactNode
}

export interface TourStepsChangeDetails extends Omit<
  CoreTourStepsChangeDetails,
  "steps"
> {
  steps: TourStepDetails[]
}

export interface TourRootApiProps extends Omit<
  CoreTourApiProps,
  "onStepsChange" | "steps"
> {
  onStepsChange?: ((details: TourStepsChangeDetails) => void) | undefined
  steps?: TourStepDetails[] | undefined
}

export interface TourApi extends Omit<
  CoreTourApi,
  "addStep" | "setSteps" | "step" | "updateStep"
> {
  addStep: (step: TourStepDetails) => void
  setSteps: (steps: TourStepDetails[]) => void
  step: TourStepDetails | null
  updateStep: (id: string, overrides: Partial<TourStepDetails>) => void
}
