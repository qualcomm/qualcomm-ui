// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {resolveControlOverlayButtonGroupProps} from "@qualcomm-ui/qds-core/image-viewer"
import {
  CoreImageViewer,
  type CoreImageViewerControlOverlayProps,
} from "@qualcomm-ui/react-core/image-viewer"
import {ButtonGroup} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsImageViewerContext} from "./qds-image-viewer-context.js"

export interface ImageViewerControlOverlayProps extends CoreImageViewerControlOverlayProps {}

/**
 * A top-centered panel for controls. Place it directly inside ImageViewer.Viewport.
 * Appears on hover or focus within the viewport and stays visible on devices
 * without hover support.
 */
export function ImageViewerControlOverlay(
  props: ImageViewerControlOverlayProps,
): ReactElement {
  const qdsContext = useQdsImageViewerContext()
  const mergedProps = mergeProps(qdsContext.getControlOverlayBindings(), props)
  return (
    <CoreImageViewer.ControlOverlay
      {...mergedProps}
      render={<ButtonGroup {...resolveControlOverlayButtonGroupProps()} />}
    />
  )
}
