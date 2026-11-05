// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FileUploadApi, ItemProps} from "@qualcomm-ui/core/file-upload"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [FileUploadContextProvider, useFileUploadContext] =
  createGuardedContext<FileUploadApi>({
    hookName: "useFileUploadContext",
    providerName: "<FileUploadContextProvider>",
    strict: true,
  })

export const [FileUploadItemContextProvider, useFileUploadItemContext] =
  createGuardedContext<ItemProps>({
    hookName: "useFileUploadItemContext",
    providerName: "<FileUploadItemContextProvider>",
    strict: true,
  })
