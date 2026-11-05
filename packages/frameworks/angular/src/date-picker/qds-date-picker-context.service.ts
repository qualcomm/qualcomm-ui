// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsDatePickerApi} from "@qualcomm-ui/qds-core/date-picker"

@Injectable()
export class QdsDatePickerContextService extends BaseApiContextService<QdsDatePickerApi> {}

export const [
  QDS_DATE_PICKER_CONTEXT,
  useQdsDatePickerContext,
  provideQdsDatePickerContext,
]: ApiContext<QdsDatePickerApi> = createApiContext<QdsDatePickerApi>(
  "QdsDatePickerContext",
  QdsDatePickerContextService,
)
