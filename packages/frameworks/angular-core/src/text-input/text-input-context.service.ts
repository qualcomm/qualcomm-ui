// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {TextInputApi} from "@qualcomm-ui/core/text-input"

@Injectable()
export class TextInputContextService extends BaseApiContextService<TextInputApi> {}

export const [
  TEXT_INPUT_CONTEXT,
  useTextInputContext,
  provideTextInputContext,
]: ApiContext<TextInputApi> = createApiContext<TextInputApi>(
  "TextInputContext",
  TextInputContextService,
)
