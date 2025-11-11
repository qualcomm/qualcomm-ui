// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {NumberInputApi} from "@qualcomm-ui/core/number-input"

@Injectable()
export class NumberInputContextService extends BaseApiContextService<NumberInputApi> {}

export const [
  NUMBER_INPUT_CONTEXT,
  useNumberInputContext,
  provideNumberInputContext,
]: ApiContext<NumberInputApi> = createApiContext<NumberInputApi>(
  "NumberInputContext",
  NumberInputContextService,
)
