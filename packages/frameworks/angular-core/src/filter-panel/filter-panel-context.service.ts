// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {FilterPanelApi} from "@qualcomm-ui/core/filter-panel"

@Injectable()
export class FilterPanelContextService extends BaseApiContextService<FilterPanelApi> {}

export const [
  FILTER_PANEL_CONTEXT,
  useFilterPanelContext,
  provideFilterPanelContext,
]: ApiContext<FilterPanelApi> = createApiContext<FilterPanelApi>(
  "FilterPanelContext",
  FilterPanelContextService,
)
