// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"

/**
 * Contextual button props. Explicit button inputs override these values.
 */
@Injectable()
export class QdsButtonPropsContextService extends BaseApiContextService<QdsButtonApiProps> {}

export const [
  QDS_BUTTON_PROPS_CONTEXT,
  useQdsButtonPropsContext,
  provideQdsButtonPropsContext,
]: ApiContext<QdsButtonApiProps> = createApiContext<QdsButtonApiProps>(
  "QdsButtonPropsContext",
  QdsButtonPropsContextService,
)
