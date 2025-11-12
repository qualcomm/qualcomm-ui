// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {SliderApi} from "@qualcomm-ui/core/slider"

@Injectable()
export class SliderContextService extends BaseApiContextService<SliderApi> {}

export const [SLIDER_CONTEXT, useSliderContext, provideSliderContext] =
  createApiContext<SliderApi>("SliderContext", SliderContextService)
