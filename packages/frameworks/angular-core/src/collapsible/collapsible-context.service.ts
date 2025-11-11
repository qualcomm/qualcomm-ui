// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {CollapsibleApi} from "@qualcomm-ui/core/collapsible"

@Injectable()
export class CollapsibleContextService extends BaseApiContextService<CollapsibleApi> {}

export const [
  COLLAPSIBLE_CONTEXT,
  useCollapsibleContext,
  provideCollapsibleContext,
]: ApiContext<CollapsibleApi> = createApiContext<CollapsibleApi>(
  "CollapsibleContext",
  CollapsibleContextService,
)
