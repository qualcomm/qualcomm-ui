// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsSliderApi} from "@qualcomm-ui/qds-core/slider"

@Injectable()
export class QdsSliderContextService extends BaseApiContextService<QdsSliderApi> {}

export const [
  QDS_SLIDER_CONTEXT,
  useQdsSliderContext,
  provideQdsSliderContext,
]: ApiContext<QdsSliderApi> = createApiContext<QdsSliderApi>(
  "QdsSliderContext",
  QdsSliderContextService,
)
