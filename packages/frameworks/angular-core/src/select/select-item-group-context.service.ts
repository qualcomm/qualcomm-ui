// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {ItemGroupProps} from "@qualcomm-ui/core/select"

@Injectable()
export class SelectItemGroupContextService extends BaseApiContextService<ItemGroupProps> {}

export const [
  SELECT_ITEM_GROUP_CONTEXT,
  useSelectItemGroupContext,
  provideSelectItemGroupContext,
]: ApiContext<ItemGroupProps> = createApiContext<ItemGroupProps>(
  "SelectItemGroupContext",
  SelectItemGroupContextService,
)
