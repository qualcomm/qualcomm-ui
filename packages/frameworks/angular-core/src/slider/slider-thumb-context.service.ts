// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {ThumbProps} from "@qualcomm-ui/core/slider"

@Injectable()
export class SliderThumbContextService extends BaseApiContextService<ThumbProps> {}

export const [
  SLIDER_THUMB_CONTEXT,
  useSliderThumbContext,
  provideSliderThumbContext,
] = createApiContext<ThumbProps>(
  "SliderThumbContext",
  SliderThumbContextService,
)
