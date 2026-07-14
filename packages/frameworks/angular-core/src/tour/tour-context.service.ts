// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {TourApi} from "@qualcomm-ui/core/tour"

@Injectable()
export class TourContextService extends BaseApiContextService<TourApi> {}

export const [TOUR_CONTEXT, useTourContext, provideTourContext] =
  createApiContext<TourApi>("TourContext", TourContextService)
