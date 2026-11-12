// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsJsonViewerOptions} from "@qualcomm-ui/qds-core/json-viewer"

@Injectable()
export class JsonViewerOptionsContextService extends BaseApiContextService<QdsJsonViewerOptions> {}

export const [
  JSON_VIEWER_OPTIONS_CONTEXT,
  useJsonViewerOptionsContext,
  provideJsonViewerOptionsContext,
]: ApiContext<QdsJsonViewerOptions> = createApiContext<QdsJsonViewerOptions>(
  "JsonViewerOptionsContext",
  JsonViewerOptionsContextService,
)
