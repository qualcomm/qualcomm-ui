// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsSegmentedControlApi} from "@qualcomm-ui/qds-core/segmented-control"

@Injectable()
export class QdsSegmentedControlContextService extends BaseApiContextService<QdsSegmentedControlApi> {}

export const [
  QDS_SEGMENTED_CONTROL_CONTEXT,
  useQdsSegmentedControlContext,
  provideQdsSegmentedControlContext,
]: ApiContext<QdsSegmentedControlApi> =
  createApiContext<QdsSegmentedControlApi>(
    "QdsSegmentedControlContext",
    QdsSegmentedControlContextService,
  )
