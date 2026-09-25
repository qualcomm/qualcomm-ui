// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {JsonNodePreviewOptions} from "@qualcomm-ui/utils/json-tree"

export interface JsonViewerOptions extends Partial<JsonNodePreviewOptions> {
  /**
   * Whether to wrap property keys in double quotes.
   *
   * @default false
   */
  quotesOnKeys?: boolean
}

export const JSON_VIEWER_OPTION_KEYS = [
  "collapseStringsAfterLength",
  "groupArraysAfterLength",
  "maxPreviewItems",
  "quotesOnKeys",
  "showNonenumerable",
] as const satisfies readonly (keyof JsonViewerOptions)[]

export const [JsonViewerOptionsProvider, useJsonViewerOptions] =
  createGuardedContext<JsonViewerOptions>({
    hookName: "useJsonViewerOptions",
    name: "JsonViewerOptionsContext",
    providerName: "<JsonViewer.Root />",
    strict: false,
  })
