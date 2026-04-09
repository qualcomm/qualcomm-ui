// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {StepperApi} from "@qualcomm-ui/core/stepper"

@Injectable()
export class StepperContextService extends BaseApiContextService<StepperApi> {}

export const [
  STEPPER_CONTEXT,
  useStepperContext,
  provideStepperContext,
]: ApiContext<StepperApi> = createApiContext<StepperApi>(
  "StepperContext",
  StepperContextService,
)
