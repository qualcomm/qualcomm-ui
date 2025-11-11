// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {ItemGroupContext} from "@qualcomm-ui/core/menu"

@Injectable()
export class MenuItemGroupContextService extends BaseApiContextService<ItemGroupContext> {}

export const [
  MENU_ITEM_GROUP_CONTEXT,
  useMenuItemGroupContext,
  provideMenuItemGroupContext,
]: ApiContext<ItemGroupContext> = createApiContext<ItemGroupContext>(
  "MenuItemGroupContext",
  MenuItemGroupContextService,
)
