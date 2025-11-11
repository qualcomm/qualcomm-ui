// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {SwitchApi} from "@qualcomm-ui/core/switch"

@Injectable()
export class SwitchContextService extends BaseApiContextService<SwitchApi> {}

export const [
  SWITCH_CONTEXT,
  useSwitchContext,
  provideSwitchContext,
]: ApiContext<SwitchApi> = createApiContext<SwitchApi>(
  "SwitchContext",
  SwitchContextService,
)
