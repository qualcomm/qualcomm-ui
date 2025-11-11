// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsNumberInputApi} from "@qualcomm-ui/qds-core/number-input"

@Injectable()
export class QdsNumberInputContextService extends BaseApiContextService<QdsNumberInputApi> {}

export const [
  QDS_NUMBER_INPUT_CONTEXT,
  useQdsNumberInputContext,
  provideQdsNumberInputContext,
]: ApiContext<QdsNumberInputApi> = createApiContext<QdsNumberInputApi>(
  "QdsNumberInputContext",
  QdsNumberInputContextService,
)
