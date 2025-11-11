// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {
  QdsButtonApiProps,
  QdsButtonGroupApiProps,
} from "@qualcomm-ui/qds-core/button"

export interface ButtonGroupContextValue
  extends Pick<
    QdsButtonGroupApiProps,
    keyof QdsButtonGroupApiProps & keyof QdsButtonApiProps
  > {}

@Injectable()
export class QdsButtonGroupContextService extends BaseApiContextService<ButtonGroupContextValue> {}

export const [
  QDS_BUTTON_GROUP_CONTEXT,
  useQdsButtonGroupContext,
  provideQdsButtonGroupContext,
]: ApiContext<ButtonGroupContextValue> =
  createApiContext<ButtonGroupContextValue>(
    "QdsButtonGroupContext",
    QdsButtonGroupContextService,
  )
