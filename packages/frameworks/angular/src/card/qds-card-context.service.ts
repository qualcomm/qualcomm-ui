// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsCardApi} from "@qualcomm-ui/qds-core/card"

@Injectable()
export class QdsCardContextService extends BaseApiContextService<QdsCardApi> {}

export const [
  QDS_CARD_CONTEXT,
  useQdsCardContext,
  provideQdsCardContext,
]: ApiContext<QdsCardApi> = createApiContext<QdsCardApi>(
  "QdsCardContext",
  QdsCardContextService,
)
