// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {JsonNodePreviewOptions} from "@qualcomm-ui/utils/json-tree"

export interface JsonViewerOptions extends Partial<JsonNodePreviewOptions> {
  /**
   * Whether to wrap property keys in double quotes.
   *
   * @default false
   */
  quotesOnKeys?: boolean
}

@Injectable()
export class JsonViewerOptionsContextService extends BaseApiContextService<JsonViewerOptions> {}

export const [
  JSON_VIEWER_OPTIONS_CONTEXT,
  useJsonViewerOptionsContext,
  provideJsonViewerOptionsContext,
]: ApiContext<JsonViewerOptions> = createApiContext<JsonViewerOptions>(
  "JsonViewerOptionsContext",
  JsonViewerOptionsContextService,
)
