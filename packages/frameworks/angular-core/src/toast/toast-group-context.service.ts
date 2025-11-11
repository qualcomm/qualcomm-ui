// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {ToastGroupApi} from "@qualcomm-ui/core/toast"

@Injectable()
export class ToastGroupContextService extends BaseApiContextService<ToastGroupApi> {}

export const [
  TOAST_GROUP_CONTEXT,
  useToastGroupContext,
  provideToastGroupContext,
]: ApiContext<ToastGroupApi> = createApiContext<ToastGroupApi>(
  "ToastGroupContext",
  ToastGroupContextService,
)
