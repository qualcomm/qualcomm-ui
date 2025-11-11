// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsCheckboxApi} from "@qualcomm-ui/qds-core/checkbox"

@Injectable()
export class QdsCheckboxContextService extends BaseApiContextService<QdsCheckboxApi> {}

export const [
  QDS_CHECKBOX_CONTEXT,
  useQdsCheckboxContext,
  provideQdsCheckboxContext,
]: ApiContext<QdsCheckboxApi> = createApiContext<QdsCheckboxApi>(
  "QdsCheckboxContext",
  QdsCheckboxContextService,
)
