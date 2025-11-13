// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsBadgeApi} from "@qualcomm-ui/qds-core/badge"

@Injectable()
export class QdsBadgeContextService extends BaseApiContextService<QdsBadgeApi> {}

export const [
  QDS_BADGE_CONTEXT,
  useQdsBadgeContext,
  provideQdsBadgeContext,
]: ApiContext<QdsBadgeApi> = createApiContext<QdsBadgeApi>(
  "QdsBadgeContext",
  QdsBadgeContextService,
)
