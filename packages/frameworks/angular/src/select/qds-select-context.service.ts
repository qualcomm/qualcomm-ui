// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsSelectApi} from "@qualcomm-ui/qds-core/select"

@Injectable()
export class QdsSelectContextService extends BaseApiContextService<QdsSelectApi> {}

export const [
  QDS_SELECT_CONTEXT,
  useQdsSelectContext,
  provideQdsSelectContext,
]: ApiContext<QdsSelectApi> = createApiContext<QdsSelectApi>(
  "QdsSelectContext",
  QdsSelectContextService,
)
