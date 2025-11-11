// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {CheckboxApi} from "@qualcomm-ui/core/checkbox"

@Injectable()
export class CheckboxContextService extends BaseApiContextService<CheckboxApi> {}

export const [
  CHECKBOX_CONTEXT,
  useCheckboxContext,
  provideCheckboxContext,
]: ApiContext<CheckboxApi> = createApiContext<CheckboxApi>(
  "CheckboxContext",
  CheckboxContextService,
)
