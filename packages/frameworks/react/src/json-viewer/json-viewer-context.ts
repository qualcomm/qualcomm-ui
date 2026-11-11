// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsJsonViewerOptions} from "@qualcomm-ui/qds-core/json-viewer"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [JsonViewerOptionsProvider, useJsonViewerOptions] =
  createGuardedContext<QdsJsonViewerOptions>({
    hookName: "useJsonViewerOptions",
    name: "JsonViewerOptionsContext",
    providerName: "<JsonViewer.Root />",
    strict: false,
  })
