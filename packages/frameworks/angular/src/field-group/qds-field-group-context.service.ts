// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsFieldGroupApi} from "@qualcomm-ui/qds-core/field-group"

@Injectable()
export class QdsFieldGroupContextService extends BaseApiContextService<QdsFieldGroupApi> {}

export const [
  QDS_FIELD_GROUP_CONTEXT,
  useQdsFieldGroupContext,
  provideQdsFieldGroupContext,
]: ApiContext<QdsFieldGroupApi> = createApiContext<QdsFieldGroupApi>(
  "QdsFieldGroupContext",
  QdsFieldGroupContextService,
)
