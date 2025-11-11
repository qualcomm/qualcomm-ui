// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {RadioItemGroupContext} from "@qualcomm-ui/core/menu"

@Injectable()
export class MenuRadioItemGroupContextService extends BaseApiContextService<RadioItemGroupContext> {}

export const [
  MENU_RADIO_ITEM_GROUP_CONTEXT,
  useMenuRadioItemGroupContext,
  provideMenuRadioItemGroupContext,
]: ApiContext<RadioItemGroupContext> = createApiContext<RadioItemGroupContext>(
  "MenuRadioItemGroupContext",
  MenuRadioItemGroupContextService,
)
