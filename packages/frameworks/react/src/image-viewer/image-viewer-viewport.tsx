// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreImageViewer,
  type CoreImageViewerViewportProps,
} from "@qualcomm-ui/react-core/image-viewer"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsImageViewerContext} from "./qds-image-viewer-context.js"

export interface ImageViewerViewportProps extends CoreImageViewerViewportProps {}

/**
 * The focusable viewport for panning and zooming the image.
 */
export function ImageViewerViewport(
  props: ImageViewerViewportProps,
): ReactElement {
  const qdsContext = useQdsImageViewerContext()
  const mergedProps = mergeProps(qdsContext.getViewportBindings(), props)
  return <CoreImageViewer.Viewport {...mergedProps} />
}
