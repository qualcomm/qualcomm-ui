// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {createQdsImageViewerApi} from "@qualcomm-ui/qds-core/image-viewer"
import {
  CoreImageViewer,
  type CoreImageViewerRootProps,
} from "@qualcomm-ui/react-core/image-viewer"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsImageViewerContextProvider} from "./qds-image-viewer-context.js"

/**
 * @since 1.32.0
 */
export interface ImageViewerRootProps extends CoreImageViewerRootProps {}

/**
 * Groups the image viewer parts and manages their state.
 */
export function ImageViewerRoot(props: ImageViewerRootProps): ReactElement {
  const qdsContext = useMemo(() => createQdsImageViewerApi(normalizeProps), [])
  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)
  return (
    <QdsImageViewerContextProvider value={qdsContext}>
      <CoreImageViewer.Root {...mergedProps} />
    </QdsImageViewerContextProvider>
  )
}
