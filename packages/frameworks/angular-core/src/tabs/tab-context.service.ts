// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {TabProps} from "@qualcomm-ui/core/tabs"

@Injectable()
export class TabContextService extends BaseApiContextService<TabProps> {}

export const [
  TAB_CONTEXT,
  useTabContext,
  provideTabContext,
]: ApiContext<TabProps> = createApiContext<TabProps>(
  "TabContext",
  TabContextService,
)
