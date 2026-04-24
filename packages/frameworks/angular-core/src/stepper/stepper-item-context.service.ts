// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {StepperItemProps} from "@qualcomm-ui/core/stepper"

@Injectable()
export class StepperItemContextService extends BaseApiContextService<StepperItemProps> {}

export const [
  STEPPER_ITEM_CONTEXT,
  useStepperItemContext,
  provideStepperItemContext,
]: ApiContext<StepperItemProps> = createApiContext<StepperItemProps>(
  "StepperItemContext",
  StepperItemContextService,
)
