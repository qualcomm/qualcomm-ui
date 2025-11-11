// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {MenuSchema} from "@qualcomm-ui/core/menu"
import type {Machine} from "@qualcomm-ui/utils/machine"

@Injectable()
export class MenuMachineContextService extends BaseApiContextService<
  Machine<MenuSchema>
> {}

export const [
  MENU_MACHINE_CONTEXT,
  useMenuMachineContext,
  provideMenuMachineContext,
]: ApiContext<Machine<MenuSchema>> = createApiContext<Machine<MenuSchema>>(
  "MenuMachineContext",
  MenuMachineContextService,
)
