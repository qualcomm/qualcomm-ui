// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {StepperApiProps} from "./stepper.types.js"

const stepperProps: (keyof StepperApiProps)[] = createProps<StepperApiProps>()(
  "canGoToStep",
  "completed",
  "count",
  "defaultStep",
  "dir",
  "getRootNode",
  "invalid",
  "isStepSkippable",
  "linear",
  "onStepChange",
  "onStepInvalid",
  "orientation",
  "pending",
  "step",
)

export const splitStepperProps: <Props extends StepperApiProps>(
  props: Props,
) => [StepperApiProps, Omit<Props, keyof StepperApiProps>] =
  createSplitProps<StepperApiProps>(stepperProps)
