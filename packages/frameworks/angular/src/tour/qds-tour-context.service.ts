// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsTourApi} from "@qualcomm-ui/qds-core/tour"

@Injectable()
export class QdsTourContextService extends BaseApiContextService<QdsTourApi> {}

export const [QDS_TOUR_CONTEXT, useQdsTourContext, provideQdsTourContext] =
  createApiContext<QdsTourApi>("QdsTourContext", QdsTourContextService)
