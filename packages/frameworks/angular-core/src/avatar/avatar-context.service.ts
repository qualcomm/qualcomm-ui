// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {AvatarApi} from "@qualcomm-ui/core/avatar"

@Injectable()
export class AvatarContextService extends BaseApiContextService<AvatarApi> {}

export const [AVATAR_CONTEXT, useAvatarContext, provideAvatarContext] =
  createApiContext<AvatarApi>("AvatarContext", AvatarContextService)
