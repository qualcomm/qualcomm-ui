// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {ItemState} from "@qualcomm-ui/core/select"

@Injectable()
export class SelectItemContextService extends BaseApiContextService<ItemState> {}

export const [
  SELECT_ITEM_CONTEXT,
  useSelectItemContext,
  provideSelectItemContext,
]: ApiContext<ItemState> = createApiContext<ItemState>(
  "SelectItemContext",
  SelectItemContextService,
)
