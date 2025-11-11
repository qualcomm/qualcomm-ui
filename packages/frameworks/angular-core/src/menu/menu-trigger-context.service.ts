// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {MenuTriggerContextValue} from "@qualcomm-ui/core/menu"

@Injectable()
export class MenuTriggerContextService extends BaseApiContextService<MenuTriggerContextValue> {}

export const [
  MENU_TRIGGER_CONTEXT,
  useMenuTriggerContext,
  provideMenuTriggerContext,
]: ApiContext<MenuTriggerContextValue> =
  createApiContext<MenuTriggerContextValue>(
    "MenuTriggerContext",
    MenuTriggerContextService,
  )
