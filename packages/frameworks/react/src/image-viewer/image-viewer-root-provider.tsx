// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {createQdsImageViewerApi} from "@qualcomm-ui/qds-core/image-viewer"
import {
  CoreImageViewer,
  type CoreImageViewerRootProviderProps,
} from "@qualcomm-ui/react-core/image-viewer"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsImageViewerContextProvider} from "./qds-image-viewer-context.js"

/**
 * @since next-release
 */
export interface ImageViewerRootProviderProps extends CoreImageViewerRootProviderProps {}

/**
 * Groups image viewer parts using an externally created API.
 */
export function ImageViewerRootProvider(
  props: ImageViewerRootProviderProps,
): ReactElement {
  const qdsContext = useMemo(() => createQdsImageViewerApi(normalizeProps), [])
  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)
  return (
    <QdsImageViewerContextProvider value={qdsContext}>
      <CoreImageViewer.RootProvider {...mergedProps} />
    </QdsImageViewerContextProvider>
  )
}
