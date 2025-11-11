// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsSwitchApi} from "@qualcomm-ui/qds-core/switch"

@Injectable()
export class QdsSwitchContextService extends BaseApiContextService<QdsSwitchApi> {}

export const [
  QDS_SWITCH_CONTEXT,
  useQdsSwitchContext,
  provideQdsSwitchContext,
]: ApiContext<QdsSwitchApi> = createApiContext<QdsSwitchApi>(
  "QdsSwitchContext",
  QdsSwitchContextService,
)
