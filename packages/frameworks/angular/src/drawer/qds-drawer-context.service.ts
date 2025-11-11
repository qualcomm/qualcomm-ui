// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsDrawerApi} from "@qualcomm-ui/qds-core/drawer"

@Injectable()
export class QdsDrawerContextService extends BaseApiContextService<QdsDrawerApi> {}

export const [
  QDS_DRAWER_CONTEXT,
  useQdsDrawerContext,
  provideQdsDrawerContext,
]: ApiContext<QdsDrawerApi> = createApiContext<QdsDrawerApi>(
  "QdsDrawerContext",
  QdsDrawerContextService,
)
