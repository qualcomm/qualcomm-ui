// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createGuardedContext} from "@qualcomm-ui/react-core/context"

interface ImageViewerImageContextValue {
  alt?: string
  src?: string
}

export const [ImageViewerImageContextProvider, useImageViewerImageContext] =
  createGuardedContext<ImageViewerImageContextValue>({
    hookName: "useImageViewerImageContext",
    providerName: "<ImageViewerImageContextProvider>",
    strict: true,
  })
