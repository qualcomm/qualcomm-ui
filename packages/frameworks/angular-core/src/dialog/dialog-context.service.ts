// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable, type Provider} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import {
  providePresenceContext,
  provideRenderStrategyContext,
} from "@qualcomm-ui/angular-core/presence"
import {type DialogApi} from "@qualcomm-ui/core/dialog"

@Injectable()
export class DialogContextService extends BaseApiContextService<DialogApi> {}

const [
  DIALOG_CONTEXT,
  useDialogContext,
  provideDialogContextService,
]: ApiContext<DialogApi> = createApiContext<DialogApi>(
  "DialogContext",
  DialogContextService,
)

export {DIALOG_CONTEXT, useDialogContext}

export function provideDialogContext(): Provider[] {
  return [
    ...provideDialogContextService(),
    ...providePresenceContext(),
    ...provideRenderStrategyContext(),
  ]
}
