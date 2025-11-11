// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsProgressApi} from "@qualcomm-ui/qds-core/progress"

@Injectable()
export class QdsProgressContextService extends BaseApiContextService<QdsProgressApi> {}

export const [
  QDS_PROGRESS_CONTEXT,
  useQdsProgressContext,
  provideQdsProgressContext,
]: ApiContext<QdsProgressApi> = createApiContext<QdsProgressApi>(
  "QdsProgressContext",
  QdsProgressContextService,
)
