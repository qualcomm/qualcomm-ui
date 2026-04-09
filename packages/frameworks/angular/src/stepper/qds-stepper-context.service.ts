// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsStepperApi} from "@qualcomm-ui/qds-core/stepper"

@Injectable()
export class QdsStepperContextService extends BaseApiContextService<QdsStepperApi> {}

export const [
  QDS_STEPPER_CONTEXT,
  useQdsStepperContext,
  provideQdsStepperContext,
]: ApiContext<QdsStepperApi> = createApiContext<QdsStepperApi>(
  "QdsStepperContext",
  QdsStepperContextService,
)
