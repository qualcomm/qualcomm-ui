// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsTabsApi} from "@qualcomm-ui/qds-core/tabs"

@Injectable()
export class QdsTabsContextService extends BaseApiContextService<QdsTabsApi> {}

export const [
  QDS_TABS_CONTEXT,
  useQdsTabsContext,
  provideQdsTabsContext,
]: ApiContext<QdsTabsApi> = createApiContext<QdsTabsApi>(
  "QdsTabsContext",
  QdsTabsContextService,
)
