// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsFilterPanelApi} from "@qualcomm-ui/qds-core/filter-panel"

@Injectable()
export class QdsFilterPanelContextService extends BaseApiContextService<QdsFilterPanelApi> {}

export const [
  QDS_FILTER_PANEL_CONTEXT,
  useQdsFilterPanelContext,
  provideQdsFilterPanelContext,
]: ApiContext<QdsFilterPanelApi> = createApiContext<QdsFilterPanelApi>(
  "QdsFilterPanelContext",
  QdsFilterPanelContextService,
)
