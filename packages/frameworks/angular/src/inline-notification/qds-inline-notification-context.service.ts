// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsNotificationApi} from "@qualcomm-ui/qds-core/inline-notification"

@Injectable()
export class QdsInlineNotificationContextService extends BaseApiContextService<QdsNotificationApi> {}

export const [
  QDS_INLINE_NOTIFICATION_CONTEXT,
  useQdsInlineNotificationContext,
  provideQdsInlineNotificationContext,
]: ApiContext<QdsNotificationApi> = createApiContext<QdsNotificationApi>(
  "QdsInlineNotificationContext",
  QdsInlineNotificationContextService,
)
