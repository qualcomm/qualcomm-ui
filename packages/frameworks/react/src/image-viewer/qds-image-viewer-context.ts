// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsImageViewerApi} from "@qualcomm-ui/qds-core/image-viewer"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

const [QdsImageViewerContextProvider, useQdsImageViewerContextValue] =
  createGuardedContext<QdsImageViewerApi>({
    hookName: "useQdsImageViewerContext",
    providerName: "<QdsImageViewerContextProvider>",
    strict: true,
  })

export {QdsImageViewerContextProvider}

export function useQdsImageViewerContext(): QdsImageViewerApi {
  return useQdsImageViewerContextValue()
}
