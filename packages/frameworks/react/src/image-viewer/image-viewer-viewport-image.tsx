// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreImageViewer,
  type CoreImageViewerViewportImageProps,
} from "@qualcomm-ui/react-core/image-viewer"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsImageViewerContext} from "./qds-image-viewer-context.js"

export interface ImageViewerViewportImageProps extends CoreImageViewerViewportImageProps {}

/** The expanded image inside Viewport. Its src and alt default to the root values. */
export function ImageViewerViewportImage(
  props: ImageViewerViewportImageProps,
): ReactElement {
  const qds = useQdsImageViewerContext()
  return (
    <CoreImageViewer.ViewportImage
      {...mergeProps(qds.getViewportImageBindings(), props)}
    />
  )
}
