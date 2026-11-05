// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ImageViewerApi} from "@qualcomm-ui/core/image-viewer"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

const [ImageViewerContextProvider, useImageViewerContextValue] =
  createGuardedContext<ImageViewerApi>({
    hookName: "useImageViewerContext",
    providerName: "<ImageViewerContextProvider>",
    strict: true,
  })

export {ImageViewerContextProvider}

/**
 * Returns the API of the nearest image viewer.
 */
export function useImageViewerContext(): ImageViewerApi {
  return useImageViewerContextValue()
}
