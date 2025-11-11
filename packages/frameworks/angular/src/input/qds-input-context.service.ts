// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsInputApi, QdsInputApiProps} from "@qualcomm-ui/qds-core/input"

export interface QdsAngularInputApiProps
  extends QdsInputApiProps<LucideIconOrString> {}

export interface QdsAngularInputApi extends QdsInputApi<LucideIconOrString> {}

@Injectable()
export class QdsInputContextService extends BaseApiContextService<
  QdsInputApi<LucideIconOrString>
> {}

export const [
  QDS_INPUT_CONTEXT,
  useQdsInputContext,
  provideQdsInputContext,
]: ApiContext<QdsInputApi<LucideIconOrString>> = createApiContext<
  QdsInputApi<LucideIconOrString>
>("QdsInputContext", QdsInputContextService)
