// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {TabsApi} from "@qualcomm-ui/core/tabs"

@Injectable()
export class TabsContextService extends BaseApiContextService<TabsApi> {}

export const [
  TABS_CONTEXT,
  useTabsContext,
  provideTabsContext,
]: ApiContext<TabsApi> = createApiContext<TabsApi>(
  "TabsContext",
  TabsContextService,
)
