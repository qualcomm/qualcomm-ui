// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsFileUploadApi} from "@qualcomm-ui/qds-core/file-upload"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsFileUploadContextProvider, useQdsFileUploadContext] =
  createGuardedContext<QdsFileUploadApi>({
    hookName: "useQdsFileUploadContext",
    providerName: "<QdsFileUploadContextProvider>",
    strict: true,
  })
