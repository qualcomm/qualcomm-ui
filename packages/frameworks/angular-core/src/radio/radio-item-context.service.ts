// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {RadioItemContext} from "@qualcomm-ui/core/radio"

@Injectable()
export class RadioItemContextService extends BaseApiContextService<RadioItemContext> {}

export const [
  RADIO_ITEM_CONTEXT,
  useRadioItemContext,
  provideRadioItemContext,
]: ApiContext<RadioItemContext> = createApiContext<RadioItemContext>(
  "RadioItemContext",
  RadioItemContextService,
)
