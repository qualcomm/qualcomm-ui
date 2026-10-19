// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreImageViewer,
  type CoreImageViewerImageProps,
} from "@qualcomm-ui/react-core/image-viewer"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsImageViewerContext} from "./qds-image-viewer-context.js"

export interface ImageViewerImageProps extends CoreImageViewerImageProps {}

/**
 * The image displayed in the viewer. Supply descriptive alt text.
 */
export function ImageViewerImage(props: ImageViewerImageProps): ReactElement {
  const qdsContext = useQdsImageViewerContext()
  const mergedProps = mergeProps(qdsContext.getImageBindings(), props)
  return <CoreImageViewer.Image {...mergedProps} />
}
